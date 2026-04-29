# Stage 1: Build the frontend with Bun
FROM oven/bun:1-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/bun.lock ./

# Use cache mounts to dramatically speed up subsequent bun installs
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Copy the rest of the frontend source and build
COPY frontend/ ./
RUN bun run build

# Stage 2: Build the backend with Go
FROM golang:alpine AS backend-builder
WORKDIR /app

# Add required alpine packages for production (timezone and SSL certs)
RUN apk add --no-cache tzdata ca-certificates

# Copy go.mod and go.sum and download dependencies using cache
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

# Copy the application source code
COPY main.go ./

# Build the application with optimizations:
# -ldflags="-w -s" removes debugging info and symbol tables, making the binary much smaller
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server main.go

# Stage 3: Final lightweight production image
FROM alpine:latest
WORKDIR /app

# Security: Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy timezone data and SSL certificates from builder
COPY --from=backend-builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=backend-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the compiled Go binary and frontend static files
# Use --chown directly to prevent Docker from creating redundant file layers
COPY --from=backend-builder --chown=appuser:appgroup /app/server .
COPY --from=frontend-builder --chown=appuser:appgroup /app/dist ./frontend/dist

# Security: Switch from root to the new restricted user
USER appuser

EXPOSE 3000

CMD ["./server"]
