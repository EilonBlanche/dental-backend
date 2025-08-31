-- ========================================
-- Dental Office Database Migration Script
-- ========================================


-- Drop tables if they exist (reverse order of dependencies)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS dentists;
DROP TABLE IF EXISTS status;

-- ========================================
-- Create status table
-- ========================================
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

-- Insert predefined status values
INSERT INTO status (id, description) VALUES
(1, 'CONFIRMED'),
(2, 'CANCELLED'),
(3, 'RESCHEDULED');

-- ========================================
-- Create users table
-- ========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_updated TIMESTAMPTZ,
    is_admin BOOLEAN NOT NULL DEFAULT false
);

-- Insert sample users
INSERT INTO users (id, name, email, password, date_created, date_updated, is_admin) VALUES
(1, 'Test Admin', 'test@admin.com', '$2b$10$Sp40Q49MXLwNYzuxCyNQQOSkZwtOSrQ0zDkA2F6vvPnQXaZWP5T/i', '2025-08-26 12:59:24.256+08', '2025-08-26 12:59:24.261+08', true),
(2, 'Test User', 'test@user.com', '$2b$10$bJm9vHuytXS8lSlLawa1qOxcxInIOtkU5dAp6twgQHDZDPYzczkzC', '2025-08-26 16:09:16.367+08', '2025-08-27 22:47:52.371+08', false);

-- ========================================
-- Create dentists table
-- ========================================
CREATE TABLE dentists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_updated TIMESTAMPTZ,
    specialization VARCHAR(50),
    available_start TIME,
    available_end TIME,
    email VARCHAR(50)
);

-- Insert sample dentists
INSERT INTO dentists (id, name, date_created, date_updated, specialization, available_start, available_end, email) VALUES
(1, 'Juan Dela Cruz', '2025-08-31 14:26:10.611+00', '2025-08-31 14:26:10.611+00', 'Orthodontics', '09:00:00', '18:00:00', 'jdelacruz@gmail.com'),
(2, 'Jose Santos', '2025-08-31 14:27:48.942+00', '2025-08-31 14:27:48.942+00', 'Pediatric Dentistry', '12:00:00', '19:00:00', 'jsanton@test.com'),
(3, 'Maria Cruz', '2025-08-31 14:28:38.254+00', '2025-08-31 14:28:38.254+00', 'Oral Surgery', '10:00:00', '16:00:00', 'maria@test.com');

-- ========================================
-- Create appointments table
-- ========================================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    dentist_id INTEGER NOT NULL,
    date DATE NOT NULL,
    time_from TIME NOT NULL,
    time_to TIME NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_updated TIMESTAMPTZ,
    status_id INTEGER NOT NULL
);
