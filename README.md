# Project Setup Guide

## Steps to Setup the Project

1. **Clone the Project:**

   ```sh
   git clone https://github.com/Eurosmart2004/Personalized-News-Recap-System.git
   cd Personalized-News-Recap-System
   ```

2. **Replace Environment Variables:**

- Copy the .env.example file to .env and replace the placeholder variables with your actual values.

3. **Use ollama**

- Download ollama
- Pull ollama by `ollama pull llama3.1`
- Run ollama

4. **Run Docker Compose:**

   ```
   docker-compose up -d --build
   ```

   or if deploy with prod

   ```
   docker-compose --env-file .env.prod -f docker-compose.prod.yaml up -d
   ```

5. **Update database**

- For SQL data import file using MySQL Workbench.
- For mongo data (datalake) create two collections manually (news and news_embeddings) at import file json respectively.
