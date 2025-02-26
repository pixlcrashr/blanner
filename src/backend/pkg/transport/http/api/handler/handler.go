package handler

import (
	"context"
	"github.com/go-faster/errors"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/lexware"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/http/api"
	"go.uber.org/zap"
	"net/http"
	"slices"
	"strconv"
)

type handler struct {
	logger  *zap.Logger
	storage *sql.Storage
}

func New(
	logger *zap.Logger,
	storage *sql.Storage,
) api.Handler {
	return &handler{
		logger:  logger,
		storage: storage,
	}
}

func externalReference(t lexware.Transaction) string {
	return strconv.Itoa(t.Index) + ":" + t.ReceiptDate.Format("2006")
}

func (h *handler) TransactionsProviderImport(
	ctx context.Context,
	req api.TransactionsProviderImportReq,
	params api.TransactionsProviderImportParams,
) ([]api.ProviderImportTransaction, error) {
	if params.Provider != api.TransactionsProviderImportProviderLexware {
		return nil, errors.New("this provider is not defined")
	}

	importer := lexware.NewImporter()
	ts, err := importer.Import(req.Data)
	if err != nil {
		h.logger.Error("could not import lexware document", zap.Error(err))
		return nil, err
	}

	bookID, err := uuid.Parse(params.BookID)
	if err != nil {
		return nil, err
	}

	ignoredRefs, err := h.storage.IgnoredImportReferences(
		ctx,
		bookID,
		0,
	)
	if err != nil {
		h.logger.Error("could fetch ignored import references", zap.Error(err))
		return nil, err
	}

	ms, err := h.storage.SearchTransactions(
		ctx,
		optional.Empty[uuid.UUID](),
		optional.From[uuid.UUID](bookID),
	)
	if err != nil {
		h.logger.Error("could not import lexware document", zap.Error(err))
		return nil, err
	}

	var res = make([]api.ProviderImportTransaction, 0)

	for _, t := range ts {
		extRef := externalReference(t)

		if slices.ContainsFunc(ms, func(m *sql.Transaction) bool {
			return m.ImportProvider.Int32 == 0 && m.ImportReference.String == extRef
		}) || slices.ContainsFunc(ignoredRefs, func(s string) bool {
			return s == extRef
		}) {
			continue
		}

		res = append(res, api.ProviderImportTransaction{
			Index:         float64(t.Index),
			ReceiptDate:   t.ReceiptDate.Format("2006-01-02"),
			BookedAt:      t.BookedAt.Format("2006-01-02"),
			Description:   t.Description,
			Amount:        t.Amount,
			DebitAccount:  t.DebitAccount,
			CreditAccount: t.CreditAccount,
			Reference:     externalReference(t),
		})
	}

	return res, nil
}

func (h *handler) NewError(ctx context.Context, err error) *api.ErrorStatusCode {
	return &api.ErrorStatusCode{
		Response: api.Error{
			Error: api.ErrorError{
				Code:    "ERROR",
				Message: "an error occurred",
			},
		},
		StatusCode: http.StatusInternalServerError,
	}
}
