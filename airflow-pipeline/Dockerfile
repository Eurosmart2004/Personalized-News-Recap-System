# Use the official Apache Airflow image as the base
FROM apache/airflow:2.2.2-python3.9

# Copy the requirements.txt file and the entrypoint script into the Docker image
COPY requirements.txt .
COPY entrypoint.sh /entrypoint.sh

# Install the Python packages listed in the requirements.txt file
RUN pip install --no-cache-dir -r requirements.txt

# Run the entrypoint script when the container starts
ENTRYPOINT ["/entrypoint.sh"]