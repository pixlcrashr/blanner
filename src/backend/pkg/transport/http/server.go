package http

import (
	"context"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/graphql"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/http/api"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/http/api/handler"
	"go.uber.org/zap"
	"net/http"
)

type Server interface {
	Serve(ctx context.Context) error
}

type server struct {
	logger  *zap.Logger
	engine  *gin.Engine
	storage *sql.Storage
	addr    string
}

var _ Server = (*server)(nil)

func NewServer(
	logger *zap.Logger,
	storage *sql.Storage,
	addr string,
) (Server, error) {
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8123", "http://localhost:4200"}, // TODO: make CORS configurable
		AllowMethods:     []string{http.MethodGet, http.MethodPost},
		AllowHeaders:     []string{"content-type", "x-batch"},
		AllowCredentials: true,
		AllowWebSockets:  false,
	}))

	r.POST("/api/graphql", graphql.EndpointHandler(
		logger,
		storage,
	))
	r.GET("/api/graphql/playground", graphql.PlaygroundHandler("/api/graphql"))

	h := handler.New(logger, storage)
	s, err := api.NewServer(h)
	if err != nil {
		return nil, err
	}

	r.Any(
		"/api/v1/*path",
		gin.WrapH(http.StripPrefix("/api/v1", s)),
	)

	return &server{
		logger:  logger,
		storage: storage,
		engine:  r,
		addr:    addr,
	}, nil
}

func (s *server) Serve(ctx context.Context) error {
	srv := &http.Server{
		Addr:    s.addr,
		Handler: s.engine,
	}

	go func() {
		select {
		case <-ctx.Done():
			s.logger.Info("shutting down GraphQL api...")

			if err := srv.Shutdown(context.Background()); err != nil {
				s.logger.Error("could not gracefully shutdown GraphQL api", zap.Error(err))
				return
			}

			s.logger.Info("shut down GraphQL api.")
		}
	}()

	return srv.ListenAndServe()
}
