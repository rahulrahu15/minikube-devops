# ---------- Stage 1: Build ----------
FROM python:3-alpine AS builder

WORKDIR /app

# Install build dependencies temporarily
RUN apk add --no-cache --virtual .build-deps \
        build-base \
        curl \
        libffi-dev \
        musl-dev \
        openssl-dev

# Copy requirements
COPY requirement.txt .

# Install dependencies into /install
RUN pip install --prefix=/install --no-cache-dir -r requirement.txt \
    && pip install --prefix=/install --no-cache-dir flask-cors requests

# Copy application code
COPY . .

# ---------- Stage 2: Runtime ----------
FROM python:3-alpine

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy app code
COPY --from=builder /app /app

# Expose port
EXPOSE 5000

CMD ["python", "app.py"]
