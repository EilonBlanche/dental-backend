# Table of Contents

- [Dental Office Backend](#dental-office-backend)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Create Database](#create-database)
  - [Run Migration](#run-migration)
  - [Running Unit Tests](#running-unit-tests)
  - [Docker Setup](#docker-setup)
  - [K3s Deployment on EC2](#k3s-deployment-on-ec2)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Appointments](#appointments)
    - [Dentists](#dentists)
- [Dental Office Backend Database](#dental-office-backend-database)

  
# Dental Office Backend

This is the **backend API** for **Dental Office**, an appointment booking system designed to manage users, appointments, and dentists. Built with **Node.js**, **Express**, and **PostgreSQL**, it serves as the server-side foundation for the frontend application.

## Features

- User registration and authentication with Admin/User roles
- Create, view, update, and delete appointments
- Manage dentist profiles and schedules (Admin only)
- Role-based access control
- Email notifications for appointment confirmations
- Daily scheduled tasks (via CRON)
- Docker-ready for easy deployment
- Deployed on **EC2** with **k3s (Lightweight Kubernetes)** and **Amazon RDS (PostgreSQL)**
- Accessible at: https://dentalbackend.ddns.net/
- Unit tests included

# Dental Office Backend Database

This repository contains the **database schema and migration scripts** for the **Dental Office** appointment booking system. The backend is built with **Node.js**, **Express**, and **PostgreSQL**, and this database powers users, appointments, and dentists.

---

## Technologies Used

- Backend Framework: Node.js, Express
- Database: PostgreSQL (Amazon RDS)
- Authentication: JWT (JSON Web Tokens)
- Email Service: Nodemailer
- Environment Variables: dotenv
- CRON Jobs: node-cron
- Containerization: Docker
- Orchestration: k3s (Lightweight Kubernetes on EC2)
- Testing: Jest / Supertest (for unit and integration tests)


## Create Database

Before running migrations, you must **create the database** manually (PostgreSQL does not allow `CREATE DATABASE` inside transactions):

```bash
psql -U postgres -d postgres -c "CREATE DATABASE dental_db;"
```

## Environment Variables

Create a `.env` file in the project root with the following placeholder values:

```bash
DB_NAME=your_database_name  
DB_USER=your_database_user  
DB_PASSWORD=your_database_password  
DB_HOST=your_host_endpoint  
DB_PORT=5432  
JWT_SECRET=your_jwt_secret  
PORT=5000  
EMAIL_SERVICE_EMAIL=your_email_address  
EMAIL_SERVICE_PASSWORD=your_email_password  
CRON_SCHEDULE=your_cron_schedule_for_email_notification
```

> Replace the placeholders with your actual credentials.


## Run Migration

```bash
npm run migrate
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EilonBlanche/dental-backend.git
   ```

3. Navigate to the project directory:
   ```bash
   cd dental-backend
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

7. Start the server:
   ```bash
   npm start
   ```

The API will run on http://localhost:5000.

## Running Unit Tests

- Run all unit tests using:
  ```bash
  npm run test
  ```
  
- Test reports and coverage (if configured) will be displayed in the terminal.

## Docker Setup

1. Build the Docker image:  
   ```bash
   docker build -t dental-backend .
   ```
2. Up services
   ```bash
   docker compose up -d
   ```
3. Add action in github repo to create a new image for every push in **.github/workflows/deploy.yml**.

The API will be accessible at http://localhost:5000.

## K3s Deployment on EC2

1. Created a Kubernetes secret for environment variables:

2. Apply the Kubernetes deployments.

4. Ensure EC2 instance can connect to the RDS instance securely via VPC and security groups.

## API Endpoints

### Authentication

- POST /api/auth/register – Register a new user  
- POST /api/auth/login – Login an existing user  

### Users

- GET /api/users – Get all users
- GET /api/users/:id – Get a user by ID  
- PUT /api/users/:id – Update a user by ID  
- DELETE /api/users/:id – Delete a user by ID  

### Appointments

- GET /api/appointments – Get all appointments  
- GET /api/appointments/:id – Get appointment by ID  
- POST /api/appointments – Create new appointment  
- PUT /api/appointments/:id – Update appointment by ID  
- DELETE /api/appointments/:id – Delete appointment by ID  

### Dentists

- GET /api/dentists – Get all dentists  
- GET /api/dentists/:id – Get dentist by ID  
- POST /api/dentists – Add new dentist  
- PUT /api/dentists/:id – Update dentist by ID  
- DELETE /api/dentists/:id – Delete dentist by ID
