package graphql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	batching "github.com/davewhit3/gqlgen-batching"
	"github.com/gin-gonic/gin"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"go.uber.org/zap"
)

func EndpointHandler(
	logger *zap.Logger,
	storage *sql.Storage,
) gin.HandlerFunc {
	schema := NewExecutableSchema(
		Config{
			Resolvers: &Resolver{
				Logger:  logger,
				Storage: storage,
			},
		},
	)

	h := handler.New(schema)
	h.AddTransport(transport.Options{})
	h.AddTransport(transport.MultipartForm{})
	h.AddTransport(batching.POST{})

	h.Use(extension.Introspection{})

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func PlaygroundHandler(graphqlUrl string) gin.HandlerFunc {
	h := playground.Handler("GraphQL", graphqlUrl)

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
