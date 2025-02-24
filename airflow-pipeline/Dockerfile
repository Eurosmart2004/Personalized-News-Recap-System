# Use the official Apache Airflow image as the base
FROM apache/airflow:2.2.2-python3.9

# Set the working directory
WORKDIR /opt/airflow

# Copy necessary files into the container
COPY requirements.txt .
COPY entrypoint.sh /entrypoint.sh
COPY dags/ dags/
COPY config/ config/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables (if not using Render's built-in environment management)
ENV AIRFLOW_HOME=/opt/airflow
ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__CORE__DAGS_FOLDER=/opt/airflow/dags


# Expose Airflow's webserver port
EXPOSE 8080

# Run the entrypoint script when the container starts
ENTRYPOINT ["/entrypoint.sh"]
