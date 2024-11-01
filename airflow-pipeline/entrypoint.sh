#!/bin/bash
set -e

# Wait for MySQL to be ready
while ! mysqladmin ping -h"${MYSQL_HOST}" --silent; do
    echo "Waiting for MySQL..."
    sleep 10
done

# Create 'airflow' database if it doesn't exist
mysql -h"${MYSQL_HOST}" -u"${MYSQL_USER}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS airflow;"

# Airflow setup
airflow db init
airflow users create --username ${AIRFLOW_USERNAME} --password ${AIRFLOW_PASSWORD} --firstname admin --lastname admin --role Admin --email ${AIRFLOW_EMAIL}

# Start Airflow
exec airflow webserver & airflow scheduler & airflow celery worker