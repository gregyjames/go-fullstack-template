# Stage 1: Build the frontend with Bun
FROM oven/bun:1-alpine AS frontend-builder
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# Copy frontend source and build
COPY frontend/ ./
RUN bun run build

# Stage 2: Build the backend with Go
FROM golang:alpine AS backend-builder
WORKDIR /app

# Copy go.mod/sum and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source and build
COPY main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o server main.go

# Stage 3: Final lightweight production image
FROM alpine:latest
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the compiled Go binary and frontend static files
COPY --from=backend-builder /app/server .
COPY --from=frontend-builder /app/dist ./dist

# Set permissions
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 3000
CMD ["./server"]
