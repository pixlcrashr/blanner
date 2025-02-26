package slices

func Map[T any, U any](slice []T, f func(T) U) []U {
	result := make([]U, len(slice))
	for i, v := range slice {
		result[i] = f(v)
	}
	return result
}

func MapWithErr[T any, U any](slice []T, f func(T) (U, error)) ([]U, error) {
	result := make([]U, len(slice))
	for i, v := range slice {
		t, err := f(v)
		
		if err != nil {
			return nil, err
		}

		result[i] = t
	}
	return result, nil
}

// MapByKey takes a slice of keys and a slice of values and returns a new slice
// where each key is mapped to its corresponding value. The resulting slice
// maintains the exact order of the input keys.
func MapByKey[K comparable, U any](ks []K, vs []U, idFn func(U) K) []U {
	m := make(map[K]U)
	for _, v := range vs {
		m[idFn(v)] = v
	}

	res := make([]U, len(ks))
	for i, id := range ks {
		res[i] = m[id]
	}

	return res
}
