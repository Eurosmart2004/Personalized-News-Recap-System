# Personalized News Recap System

## Overview

**Personalized News Recap System** is a React-based web application that delivers daily news summaries based on individual user preferences. It allows users to browse aggregated news, customize interests, and receive tailored news recaps via email.
![image](https://github.com/user-attachments/assets/2d0b4034-c9de-4acc-a823-b2c9f53edb7e)

---

## Features

- Browse news summaries by day, week, or month.
- Explore detailed news clusters.
- Update user profile and content preferences.
- Receive personalized email updates.

---

## Navigation

- **Home**: View daily news clusters.
- **News Details**: Access full summaries by clicking a cluster.
- **Profile**: Customize news topics and email settings.
- **Admin Panel**: Restricted access for system management.

---

## System Architecture
![image](https://github.com/user-attachments/assets/c823971e-2a2b-4825-912f-6050e4c23633)

### Components

| Component       | Technology         | Description                                     |
|-----------------|--------------------|-------------------------------------------------|
| Frontend        | React.js           | User interface located in the `/client` folder  |
| Backend         | Flask              | API logic in the `/server` folder               |
| Message Queue   | RabbitMQ           | Handles task queuing                            |
| Data Storage    | MongoDB Atlas      | Stores unstructured news content                |
| Relational DB   | MySQL              | Stores structured data (e.g., user info)        |
| Workflow Engine | Apache Airflow     | Orchestrates data pipelines                     |
| Task Runner     | Celery             | Executes asynchronous jobs                      |
| AI Engine       | Hugging Face Spaces| Clustering and embedding service                |

---

## Installation Guide

### Prerequisites

- Docker & Docker Compose installed
- MongoDB Atlas, Aiven (MySQL), Hugging Face Spaces accounts

### Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Configure Environment**
   - Copy `.env.template` to `.env`.
   - Replace placeholder values with actual credentials for MongoDB, MySQL, Hugging Face Spaces, etc.

3. **Launch Services**
   ```bash
   docker-compose up
   ```

> **Note**: MongoDB must be hosted on MongoDB Atlas. The AI server (server-slave) must be deployed separately on Hugging Face Spaces.

---

## Deployment Guide

### Docker Compose (Local or Server)

- Start all components:
  ```bash
  docker-compose up
  ```
- Ensure `.env` contains correct credentials.

### MongoDB Atlas

1. Create and configure a MongoDB cluster.
2. Add connection URI to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

### MySQL on Aiven

1. Provision a MySQL instance on Aiven.
2. Configure `.env` with:
   ```env
   MYSQL_HOST=<host>
   MYSQL_PORT=<port>
   MYSQL_USER=<user>
   MYSQL_PASSWORD=<password>
   MYSQL_DATABASE=<database>
   ```

### Server-Slave (Hugging Face Spaces)

1. Create a Space and deploy the server-slave repository.
2. Add the endpoint URL to `.env`:
   ```env
   SERVER_SLAVE_URL=https://<username>-<space>.hf.space
   ```

### Frontend on Vercel

1. Import the frontend GitHub repo to Vercel.
2. Configure environment variables on Vercel using `.env`.
3. Deploy and test the production URL.

---
