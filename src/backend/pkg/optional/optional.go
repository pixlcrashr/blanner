package optional

import (
	"bytes"
	"encoding/json"
)

type Optional[T any] struct {
	value T
	ok    bool
}

func (o Optional[T]) Value() T {
	return o.value
}

func (o Optional[T]) OK() bool {
	return o.ok
}

func (o Optional[T]) MarshalJSON() ([]byte, error) {
	if !o.ok {
		var buf bytes.Buffer
		buf.WriteString(`null`)

		return buf.Bytes(), nil
	}

	return json.Marshal(o.value)
}

func FromNil[T any](value *T) Optional[T] {
	if value == nil {
		return Empty[T]()
	}
	return From(*value)
}

func FromArray[T any](value []T) Optional[[]T] {
	if value == nil {
		return Empty[[]T]()
	}
	
	return From(value)
}

func From[T any](value T) Optional[T] {
	return Optional[T]{
		value: value,
		ok:    true,
	}
}

func Empty[T any]() Optional[T] {
	return Optional[T]{
		ok: false,
	}
}
