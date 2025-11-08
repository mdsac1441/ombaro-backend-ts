# Environment Setup
NODE_ENV ?= production
CONFIG_DIR = src/configs/$(shell if [ "$(NODE_ENV)" = "production" ] || [ "$(NODE_ENV)" = "PRODUCTION" ]; then echo "prod"; else echo "dev"; fi)
DRIZZLE_CONFIG = $(CONFIG_DIR)/drizzle.config.ts


# --- Targets ---
.PHONY: install generate-keys generate-jwt-key-pair generate-encryption-key-pair clean clean-keys drizzle-migration drizzle-push build run postgres-docker help

# Install dependencies with Bun
install:
	@echo "Installing dependencies using Bun..."
	@bun i
	@echo "Dependencies installed successfully."

# Generate both JWT and Encryption key pairs
generate-keys: 
	@echo "Generating JWT and Encryption key pairs..."
	@generate-jwt-key-pair generate-encryption-key-pair

# Generate Ed25519 key pair for JWT
generate-jwt-key-pair:
	@echo "Generating JWT key pair for $(CONFIG_DIR)..."
	@NODE_ENV=$(NODE_ENV) bun run scripts/generateEd25519JWTKeyPair.ts

# Generate X25519 key pair for encryption
generate-encryption-key-pair:
	@echo "Generating encryption key pair for $(CONFIG_DIR)..."
	@NODE_ENV=$(NODE_ENV) bun run scripts/generateX25519EncryptionKeyPair.ts

# Generate rsa key pair 
generate-rsa-key-pair:
	@echo "Generating key pair for $(CONFIG_DIR)..."
	@NODE_ENV=$(NODE_ENV) bun run scripts/generateRSAKeyPair.ts

# Clean generated keys
clean-keys:
	@echo "Cleaning generated keys..."
	@rm -f src/configs/dev/*.pem src/configs/prod/*.pem 

# --- Apply Drizzle Push to Database for development ---
drizzle-check:
	@echo "Running Check..."
	@bun  drizzle-kit check --config=$(DRIZZLE_CONFIG)

drizzle-pull:
	@echo "Running Pull..."
	@bun  drizzle-kit pull --config=$(DRIZZLE_CONFIG)


drizzle-push:
	@echo "Running migrations..."
	@bun  drizzle-kit push --config=$(DRIZZLE_CONFIG)

# --- Generate Migration File ---
drizzle-generate:
	@echo "Generating a new migration from schema..."
	@bun drizzle-kit generate --config=$(DRIZZLE_CONFIG)

# --- Apply Migration to Database ---
drizzle-migrate: 
	@echo "Migration generated and applied to the database."
	@bun drizzle-kit migrate --config=$(DRIZZLE_CONFIG)

drizzle-drop:
	@echo "Drop"
	@bun drizzle-kit drop --config=$(DRIZZLE_CONFIG)

# --- Build Project ---
build:
	@echo "Building Bun project..."
	bun build index.ts --outdir=dist

# --- Run Project ---
run:
	@echo "Running Elysia server..."
	bun run index.ts

# --- Dockerized DB (Optional) ---
postgres-docker:
	@echo "Running PostgreSQL container..."
	docker-compose -f docker-compose/services/docker-compose-postgres.yml up -d

redis-docker:
	@echo "Running PostgreSQL container..."
	docker-compose -f docker-compose/services/docker-compose-redis.yml up -d

	
# --- Clean ---
clean:
	@rm -rf node_modules dist 

# --- Help ---
help:
	@echo ""
	@echo "Usage:"
	@echo "  make install           - Install Bun project dependencies"
	@echo "  make init-drizzle      - Initialize Drizzle"
	@echo "  make create-migration  - Generate migration file from schema"
	@echo "  make migrate-up        - Run migrations to DB"
	@echo "  make build             - Build Bun app"
	@echo "  make run               - Run Elysia server"
	@echo "  make postgres-docker   - Start PostgreSQL container"
	@echo "  make clean             - Remove dist & node_modules"
	@echo ""