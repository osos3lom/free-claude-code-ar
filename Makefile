.PHONY: backend frontend dev lint test build

# Start FastAPI backend (port 8082)
backend:
	cd backend && uv run fcc-server

# Start Next.js frontend dev server (port 3000)
frontend:
	cd frontend && npm run dev

# Run both in parallel (requires a terminal multiplexer or background processes)
dev:
	@echo "Run in two terminals:"
	@echo "  make backend   → FastAPI on :8082"
	@echo "  make frontend  → Next.js on :3000"

# Backend quality checks
lint:
	cd backend && uv run ruff format --check && uv run ruff check && uv run ty check

# Backend test suite
test:
	cd backend && uv run pytest -q

# Frontend production build
build:
	cd frontend && npm run build
