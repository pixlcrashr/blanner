package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/pixlcrashr/blanner/src/backend/pkg/logger"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/http"
	"go.uber.org/zap"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	l := logger.New()

	db, err := gorm.Open(sqlite.Open("blanner.sqlite?_pragma=foreign_keys(1)"), &gorm.Config{})
	if err != nil {
		l.Fatal("could not open database", zap.Error(err))
	}

	s := &sql.Storage{
		DB: db,
	}

	if err := s.Migrate(context.Background()); err != nil {
		l.Fatal("could not open database", zap.Error(err))
	}

	srv, err := http.NewServer(
		l,
		s,
		"localhost:8965",
	)
	if err != nil {
		l.Fatal("could not create server", zap.Error(err))
	}

	wg := sync.WaitGroup{}

	wg.Add(1)

	go func(ctx context.Context, l *zap.Logger, srv http.Server) {
		l.Info("starting server")
		wg.Done()
		if err := srv.Serve(context.Background()); err != nil {
			l.Fatal("could not serve server", zap.Error(err))
		}

		l.Info("stopped server")
	}(ctx, l, srv)

	wg.Wait()

	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
