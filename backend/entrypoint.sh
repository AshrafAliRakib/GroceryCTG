#!/bin/sh
set -e

echo "Waiting for Postgres..."
until python manage.py makemigrations --noinput 2>/dev/null; do
  echo "Postgres not ready - sleeping"
  sleep 3
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec "$@"
