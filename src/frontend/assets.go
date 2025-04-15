package frontend

import "embed"

//go:embed all:dist/frontend/browser
var Assets embed.FS
