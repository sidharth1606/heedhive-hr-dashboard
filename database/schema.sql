-- ============================================
-- Heedhive HR Dashboard - MySQL Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS heedhive_hr;
USE heedhive_hr;

-- Users (HR Admins)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'hr', 'manager') DEFAULT 'hr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  department_id INT,
  phone VARCHAR(20),
  join_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  avatar_color VARCHAR(10) DEFAULT '#f5a623',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Attendance Records
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'wfh', 'half') NOT NULL,
  check_in TIME,
  check_out TIME,
  notes TEXT,
  marked_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (employee_id, date),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (marked_by) REFERENCES users(id)
);

-- Leave Requests
CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
