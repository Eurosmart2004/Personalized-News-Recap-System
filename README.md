# Technical Documentation for Client

## 1. User Manual

### 1.1 Introduction

This React-based web application connects you to the Personalized News Recap System, enabling you to browse aggregated news, adjust preferences, and receive tailored news updates.

### 1.2 Key Features

- Browse news summaries by day, week, or month.
- Explore detailed news clusters.
- Update your profile and news preferences.
- Receive daily personalized news emails.

### 1.3 Navigation Guide

- **Home**: View your news clusters.
- **News Details**: Click a cluster for more details.
- **Profile**: Customize settings and preferences.
- **Admin (Admins Only)**: Manage the system.

### 1.4 Getting Started

1. **Log In**: Use your email and password.
2. **Explore News**: Visit the home page.
3. **Customize**: Set preferred topics in your profile.
4. **Emails**: Confirm your schedule for daily updates.

---

## 2. Technical Manual

### 2.1 System Overview

- **Web**: React.js app in the `client` folder for the user interface.
- **Server**: Flask API in the `server` folder for backend logic.
- **Queue**: RabbitMQ for task queuing.
- **MongoDB**: MongoDB Atlas for unstructured data (e.g., news articles).
- **MySQL**: Manages structured data (e.g., user info).
- **Airflow**: Orchestrates data processing workflows.
- **Celery**: Handles asynchronous task execution.
- **Server-Slave**: AI server for clustering and embedding, deployed on Hugging Face Spaces.

### 2.2 Core Components

- **Web**: React.js frontend for user interaction.
- **Server**: Flask backend for API services.
- **Queue**: RabbitMQ for task management.
- **MongoDB**: MongoDB Atlas for unstructured data storage.
- **MySQL**: Database for structured data.
- **Airflow**: Workflow scheduler.
- **Celery**: Task runner for background jobs.
- **Server-Slave**: AI service for news clustering and embedding.

### 2.3 Setup Notes

- Use `.env` files based on `.env.template` for configuration.

---

## 3. Installation Manual

### 3.1 Requirements

- Docker and Docker Compose installed.

### 3.2 Installation Steps

1. **Get the Code**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Configure**:
   - Copy `.env.template` to `.env` and replace values for MongoDB Atlas, Hugging Face Spaces, and other services.
3. **Launch**:
   - Run all components (Web, Server, Queue, MySQL, Airflow, Celery) with:
     ```bash
     docker-compose up
     ```
   - Note: MongoDB must be hosted on MongoDB Atlas, and Server-Slave must be deployed on Hugging Face Spaces (see deployment steps below).

---

## 4. System Deployment & Delivery

### 4.1 Deployment Guide

#### **All-in-One Deployment with Docker Compose**

- Deploy Web, Server, Queue, MySQL, Airflow, and Celery using:
  ```bash
  docker-compose up
  ```
- Replace values in `.env.template` (copied to `.env`) with production settings for these components.

#### **MongoDB on Atlas (Required)**

1. **Set Up MongoDB Atlas**:
   - Create an account on MongoDB Atlas and set up a cluster.
   - Configure database name, username, and password.
   - Get the connection string (e.g., `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>`).
2. **Update Configuration**:
   - Add to `.env` (based on `.env.template`):
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```
3. **Test and Integrate**:
   - Verify connectivity and ensure the Server uses this URI.

#### **Server-Slave Deployment on Hugging Face Spaces (Required)**

1. **Deploy on Hugging Face**:
   - Create a Space on Hugging Face and link the GitHub repo for the server-slave.
   - Deploy and test the endpoint (e.g., `https://<username>-<space-name>.hf.space/cluster`).
2. **Update Configuration**:
   - Add the Hugging Face Space URL to `.env` (based on `.env.template`), e.g.:
     ```env
     SERVER_SLAVE_URL=https://<username>-<space-name>.hf.space
     ```

#### **Database Deployment (MySQL on Aiven)**

1. Create a MySQL service on Aiven (select cloud provider and region).
2. Set database name, username, and password; note connection details.
3. Add to `.env` (based on `.env.template`):
   ```env
   MYSQL_HOST=<aiven-mysql-host>
   MYSQL_PORT=<aiven-mysql-port>
   MYSQL_USER=<aiven-mysql-username>
   MYSQL_PASSWORD=<aiven-mysql-password>
   MYSQL_DATABASE=<your-database-name>
   ```
4. Test connectivity and integrate with the Server.

#### **Frontend Deployment on Vercel**

- **Deploy on Vercel**:
  - Import the GitHub repo into Vercel.
  - Deploy and test the Vercel URL.

### 4.2 Delivery

- Share the Vercel frontend URL and Hugging Face Space URL with the client.
- Provide the `.env` file with production settings (based on `.env.template`).
- Include this user manual and technical guide.
