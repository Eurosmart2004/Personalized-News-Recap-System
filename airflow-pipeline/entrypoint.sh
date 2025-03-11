#!/bin/bash
set -e


# Initialize Airflow database migrations
echo "Running database migrations..."
airflow db migrate

# Check if the Airflow user already exists before creating it
echo "Checking if the admin user exists..."
USER_EXISTS=$(airflow users list | grep -w "${AIRFLOW_USERNAME}" || true)

if [ -z "$USER_EXISTS" ]; then
    echo "Creating Airflow admin user..."
    airflow users create --username "${AIRFLOW_USERNAME}" --password "${AIRFLOW_PASSWORD}" --firstname Admin --lastname Admin --role Admin --email "${AIRFLOW_EMAIL}"
else
    echo "Admin user already exists, skipping user creation."
fi

# Start Airflow services
echo "Starting Airflow webserver, scheduler, and workers..."
exec airflow webserver & airflow scheduler & airflow celery worker