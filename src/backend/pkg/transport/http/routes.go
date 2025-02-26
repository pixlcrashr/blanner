package http

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/lexware"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"go.uber.org/zap"
	"net/http"
	"slices"
	"strconv"
	"time"
)

type transactionInfo struct {
	Index         int       `json:"index"`
	ReceiptDate   time.Time `json:"receipt_date"`
	BookedAt      time.Time `json:"booked_at"`
	Description   string    `json:"description"`
	Amount        float64   `json:"amount"`
	DebitAccount  string    `json:"debit_account"`
	CreditAccount string    `json:"credit_account"`
	Reference     string    `json:"reference"`
}

func externalReference(t lexware.Transaction) string {
	return strconv.Itoa(t.Index) + ":" + t.ReceiptDate.Format("2006")
}

func transactionAssignLexware(
	logger *zap.Logger,
	storage *sql.Storage,
) gin.HandlerFunc {
	return func(c *gin.Context) {
		importer := lexware.NewImporter()
		ts, err := importer.Import(c.Request.Body)
		if err != nil {
			logger.Error("could not import lexware document", zap.Error(err))
			c.Writer.WriteHeader(http.StatusInternalServerError)
			return
		}

		/*ignoredRefs, err := storage.IgnoredImportReferences(
			c.Request.Context(),
		)*/

		ms, err := storage.SearchTransactions(
			c.Request.Context(),
			optional.Empty[uuid.UUID](),
			optional.From[uuid.UUID](uuid.MustParse("8f7ed95b-ccd9-4c1f-9ba6-e156869a5a37")),
		)
		if err != nil {
			logger.Error("could not import lexware document", zap.Error(err))
			c.Writer.WriteHeader(http.StatusInternalServerError)
			return
		}

		var res = make([]transactionInfo, 0)

		for _, t := range ts {
			extRef := externalReference(t)

			if slices.ContainsFunc(ms, func(m *sql.Transaction) bool {
				return m.ImportProvider.Int32 == 0 && m.ImportReference.String == extRef
			}) {
				continue
			}

			res = append(res, transactionInfo{
				Index:         t.Index,
				ReceiptDate:   t.ReceiptDate,
				BookedAt:      t.BookedAt,
				Description:   t.Description,
				Amount:        t.Amount,
				DebitAccount:  t.DebitAccount,
				CreditAccount: t.CreditAccount,
				Reference:     externalReference(t),
			})
		}

		bs, err := json.Marshal(res)
		if err != nil {
			logger.Error("could not marshal json", zap.Error(err))
			c.Writer.WriteHeader(http.StatusInternalServerError)
			return
		}

		if _, err := c.Writer.Write(bs); err != nil {
			logger.Error("could not write result", zap.Error(err))
			c.Writer.WriteHeader(http.StatusInternalServerError)
			return
		}
		c.Writer.WriteHeader(http.StatusOK)
	}
}
