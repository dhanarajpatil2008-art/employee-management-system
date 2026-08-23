-- ===================================================
-- Employee Management System (EMS) Database Script
-- Contains ONLY 2 Tables: `users` and `records`
-- Simple Plain Text Passwords (No Hashing)
-- ===================================================

CREATE DATABASE IF NOT EXISTS `ems_db`;
USE `ems_db`;

-- 1. USERS TABLE (Handles both Admin and Employee)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `department` VARCHAR(100) DEFAULT 'Engineering',
    `designation` VARCHAR(100) DEFAULT 'Software Engineer',
    `role` ENUM('admin', 'employee') DEFAULT 'employee',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. RECORDS TABLE (Handles BOTH Attendance & Leave using 'type' column)
CREATE TABLE IF NOT EXISTS `records` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `type` ENUM('attendance', 'leave') NOT NULL,
    `date` DATE NULL,                    -- Attendance Date (YYYY-MM-DD)
    `from_date` DATE NULL,               -- Leave Start Date
    `to_date` DATE NULL,                 -- Leave End Date
    `status` VARCHAR(50) NOT NULL,       -- 'Present' / 'Absent' OR 'Pending' / 'Approved' / 'Rejected'
    `reason` TEXT NULL,                  -- Leave Reason or Attendance Remarks
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- ===================================================
-- INITIAL DEMO DATA FOR TESTING & PRESENTATION
-- Plain Text Passwords:
-- Admin: dhanarajpatil2008@gmail.com / 123456
-- Employee: dhanarajpatil440@gmail.com / 070980
-- ===================================================

-- Insert Default Admin
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `department`, `designation`, `role`) 
VALUES 
(1, 'Dhanaraj Patil', 'dhanarajpatil2008@gmail.com', '123456', '9876543210', 'Management', 'System Administrator', 'admin')
ON DUPLICATE KEY UPDATE `password`='123456';

-- Insert Default Employee
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `department`, `designation`, `role`) 
VALUES 
(2, 'Dhanaraj Patil', 'dhanaraj@ems.com', 'user123', '9123456780', 'Information Technology', 'Full Stack Developer', 'employee')
ON DUPLICATE KEY UPDATE `password`='user123';

-- Insert Sample Attendance
INSERT INTO `records` (`user_id`, `type`, `date`, `status`, `reason`)
VALUES 
(2, 'attendance', CURDATE(), 'Present', 'Regular In-Time Entry');

-- Insert Sample Leave Request
INSERT INTO `records` (`user_id`, `type`, `from_date`, `to_date`, `status`, `reason`)
VALUES 
(2, 'leave', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Pending', 'Family Function Leave Request');
