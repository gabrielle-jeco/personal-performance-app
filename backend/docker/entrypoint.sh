#!/bin/sh
set -e

echo "Waiting for postgres at ${DB_HOST}:${DB_PORT}..."
until php -r "
  \$host=getenv('DB_HOST'); \$port=getenv('DB_PORT');
  \$fp=@fsockopen(\$host, \$port, \$errno, \$errstr, 1);
  if (\$fp) { fclose(\$fp); exit(0); }
  exit(1);
" ; do
  sleep 1
done

echo "Postgres is up ✅"

php artisan config:clear || true
php artisan cache:clear || true

php artisan migrate --force

# Seed optional: jalanin kalau kamu set SEED=true
php artisan db:seed --force

exec php-fpm
