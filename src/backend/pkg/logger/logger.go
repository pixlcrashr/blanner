package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
)

func New() *zap.Logger {
	hP := zap.LevelEnablerFunc(func(level zapcore.Level) bool {
		return level >= zapcore.ErrorLevel
	})
	lP := zap.LevelEnablerFunc(func(level zapcore.Level) bool {
		return level < zapcore.ErrorLevel
	})

	cD := zapcore.Lock(os.Stdout)
	cE := zapcore.Lock(os.Stderr)

	consoleEncoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())

	c := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, cE, hP),
		zapcore.NewCore(consoleEncoder, cD, lP),
	)

	return zap.New(c)
}
