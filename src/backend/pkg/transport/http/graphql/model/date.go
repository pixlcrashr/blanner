package model

import (
	"errors"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

func MarshalDate(t time.Time) graphql.Marshaler {
	if t.IsZero() {
		return graphql.Null
	}

	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(t.Format(time.DateOnly)))
	})
}

func UnmarshalDate(v any) (time.Time, error) {
	if tmpStr, ok := v.(string); ok {
		return time.Parse(time.DateOnly, tmpStr)
	}
	return time.Time{}, errors.New("time should be formatted as a time.DateOnly string")
}
