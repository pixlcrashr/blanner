package lexware

import (
	"encoding/csv"
	"errors"
	"github.com/gocarina/gocsv"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
	"io"
	"strconv"
	"strings"
	"time"
)

type optionalStringCsv struct {
	String optional.Optional[string]
}

func (s *optionalStringCsv) MarshalCSV() (string, error) {
	return s.String.Value(), nil
}

func (s *optionalStringCsv) UnmarshalCSV(csv string) (err error) {
	if csv == "" {
		return nil
	}

	s.String = optional.From(csv)
	return nil
}

type dateCsv struct {
	Date *time.Time
}

func (d *dateCsv) MarshalCSV() (string, error) {
	return d.Date.Format("02.01.2006"), nil
}

func (d *dateCsv) UnmarshalCSV(csv string) (err error) {
	if csv == "" {
		return nil
	}

	date, err := time.Parse("02.01.2006", csv)
	if err != nil {
		return err
	}

	d.Date = &date
	return nil
}

type amountCsv struct {
	Amount float64
}

func (a *amountCsv) MarshalCSV() (string, error) {
	p := message.NewPrinter(language.German)

	return p.Sprintf("%.2f", a.Amount), nil
}

func (a *amountCsv) UnmarshalCSV(csv string) (err error) {
	a.Amount, err = strconv.ParseFloat(
		strings.Replace(
			strings.Replace(
				csv,
				".",
				"",
				1,
			),
			",",
			".",
			-1,
		),
		64,
	)
	return err
}

type transactionCsv struct {
	ReceiptFrom        dateCsv           `csv:"Belegdatum"`
	BookedAt           dateCsv           `csv:"Buchungsdatum"`
	ReceiptNumberGroup optionalStringCsv `csv:"Belegnummernkreis"`
	ReceiptNumber      optionalStringCsv `csv:"Belegnummer"`
	Description        string            `csv:"Buchungstext"`
	Amount             amountCsv         `csv:"Buchungsbetrag"`
	DebitAccount       string            `csv:"Sollkonto"`
	CreditAccount      string            `csv:"Habenkonto"`
	TaxKey             optionalStringCsv `csv:"Steuerschlüssel"`
	CostCategory1      optionalStringCsv `csv:"Kostenstelle 1"`
	CostCategory2      optionalStringCsv `csv:"Kostenstelle 2"`
	Additional         optionalStringCsv `csv:"Zusatzangaben"`
}

type Importer interface {
	Import(reader io.Reader) ([]Transaction, error)
}

type importer struct {
}

var _ Importer = (*importer)(nil)

func NewImporter() Importer {
	return &importer{}
}

type Transaction struct {
	Index              int                       `json:"index"`
	ReceiptDate        time.Time                 `json:"receipt_date"`
	BookedAt           time.Time                 `json:"booked_at"`
	ReceiptNumberGroup string                    `json:"receipt_number_group"`
	ReceiptNumber      string                    `json:"receipt_number"`
	Description        string                    `json:"description"`
	Amount             float64                   `json:"amount"`
	DebitAccount       string                    `json:"debit_account"`
	CreditAccount      string                    `json:"credit_account"`
	TaxKey             optional.Optional[string] `json:"tax_key"`
	CostCategory1      optional.Optional[string] `json:"cost_category_1"`
	CostCategory2      optional.Optional[string] `json:"cost_category_2"`
	AdditionalData     optional.Optional[string] `json:"additional_data"`
}

func (_ *importer) Import(reader io.Reader) ([]Transaction, error) {
	var ts []transactionCsv

	gocsv.SetCSVReader(func(in io.Reader) gocsv.CSVReader {
		r := csv.NewReader(in)
		r.LazyQuotes = true
		r.Comma = ';'

		return r
	})

	if err := gocsv.Unmarshal(reader, &ts); err != nil {
		return nil, err
	}

	if len(ts) == 0 {
		return []Transaction{}, nil
	}

	var transactions []Transaction
	i := 0
	for i < len(ts) {
		t := ts[i]

		if t.CreditAccount == "0" || t.DebitAccount == "0" {
			if i+1 >= len(ts) {
				continue
			}

			i++
			for i < len(ts) {
				nT := ts[i]
				if nT.CreditAccount != "" && nT.DebitAccount != "" {
					break
				}

				debitAccount := nT.DebitAccount
				if debitAccount == "" {
					debitAccount = t.DebitAccount
				}

				creditAccount := t.CreditAccount
				if creditAccount == "" {
					creditAccount = t.CreditAccount
				}

				transactions = append(transactions, Transaction{
					Index:              i,
					BookedAt:           *t.BookedAt.Date,
					ReceiptDate:        *t.ReceiptFrom.Date,
					Description:        nT.Description,
					AdditionalData:     nT.Additional.String,
					DebitAccount:       debitAccount,
					CreditAccount:      creditAccount,
					CostCategory1:      nT.CostCategory1.String,
					CostCategory2:      nT.CostCategory2.String,
					ReceiptNumber:      t.ReceiptNumber.String.Value(),
					ReceiptNumberGroup: t.ReceiptNumberGroup.String.Value(),
					Amount:             nT.Amount.Amount,
					TaxKey:             nT.TaxKey.String,
				})
				i++
			}
			continue
		}

		if t.BookedAt.Date == nil || t.ReceiptFrom.Date == nil {
			return nil, errors.New("expected date for the parsed transaction")
		}

		transactions = append(transactions, Transaction{
			Index:              i,
			BookedAt:           *t.BookedAt.Date,
			ReceiptDate:        *t.ReceiptFrom.Date,
			Description:        t.Description,
			AdditionalData:     t.Additional.String,
			DebitAccount:       t.DebitAccount,
			CreditAccount:      t.CreditAccount,
			CostCategory1:      t.CostCategory1.String,
			CostCategory2:      t.CostCategory2.String,
			ReceiptNumber:      t.ReceiptNumber.String.Value(),
			ReceiptNumberGroup: t.ReceiptNumberGroup.String.Value(),
			Amount:             t.Amount.Amount,
			TaxKey:             t.TaxKey.String,
		})
		i++
	}

	return transactions, nil
}
