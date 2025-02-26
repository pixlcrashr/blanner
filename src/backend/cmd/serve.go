/*
Copyright © 2025 Vincent Heins <vin@centheins.de>
*/
package cmd

import (
	"context"
	"github.com/pixlcrashr/blanner/src/backend/pkg/logger"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
	"github.com/pixlcrashr/blanner/src/backend/pkg/transport/http"
	"go.uber.org/zap"

	"github.com/glebarez/sqlite"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serves the blanner backend server.",
	Run: func(cmd *cobra.Command, args []string) {
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
			"localhost:8123",
		)
		if err != nil {
			l.Fatal("could not create server", zap.Error(err))
		}

		if err := srv.Serve(context.Background()); err != nil {
			l.Fatal("could not serve server", zap.Error(err))
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serveCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// serveCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
