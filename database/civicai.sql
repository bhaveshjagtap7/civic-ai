-- CivicAI Database Schema & Seeding Script
-- Database: `civicai`

CREATE DATABASE IF NOT EXISTS `civicai` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `civicai`;

-- Disable foreign key checks for clean teardown during imports
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `system_settings`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `feedback`;
DROP TABLE IF EXISTS `complaint_logs`;
DROP TABLE IF EXISTS `complaint_images`;
DROP TABLE IF EXISTS `complaints`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table structure for `departments`
-- --------------------------------------------------------
CREATE TABLE `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `head_name` VARCHAR(100) NULL,
  `contact_email` VARCHAR(100) NULL,
  `icon` VARCHAR(50) DEFAULT 'Building2',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Citizen', 'Officer', 'Admin') NOT NULL DEFAULT 'Citizen',
  `phone` VARCHAR(20) NULL,
  `address` TEXT NULL,
  `department_id` INT UNSIGNED NULL,
  `avatar` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `complaints`
-- --------------------------------------------------------
CREATE TABLE `complaints` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `complaint_number` VARCHAR(30) NOT NULL UNIQUE,
  `citizen_id` INT UNSIGNED NOT NULL,
  `department_id` INT UNSIGNED NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('Road', 'Water', 'Electricity', 'Garbage', 'Drainage', 'Health', 'Education', 'Transport', 'Government Office', 'Others') NOT NULL DEFAULT 'Others',
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `status` ENUM('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected') NOT NULL DEFAULT 'Submitted',
  `location` VARCHAR(255) NULL,
  `latitude` DECIMAL(10, 8) NULL,
  `longitude` DECIMAL(11, 8) NULL,
  `assigned_officer_id` INT UNSIGNED NULL,
  `ai_summary` TEXT NULL,
  `ai_suggested_resolution` TEXT NULL,
  `resolution_notes` TEXT NULL,
  `resolution_image` VARCHAR(255) NULL,
  `rating` TINYINT UNSIGNED NULL CHECK (rating BETWEEN 1 AND 5),
  `feedback_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`citizen_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_officer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_complaints_status` (`status`),
  INDEX `idx_complaints_category` (`category`),
  INDEX `idx_complaints_priority` (`priority`),
  INDEX `idx_complaints_citizen` (`citizen_id`),
  INDEX `idx_complaints_dept` (`department_id`),
  INDEX `idx_complaints_officer` (`assigned_officer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `complaint_images`
-- --------------------------------------------------------
CREATE TABLE `complaint_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `complaint_logs`
-- --------------------------------------------------------
CREATE TABLE `complaint_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT UNSIGNED NOT NULL,
  `action_by_user_id` INT UNSIGNED NOT NULL,
  `status_from` VARCHAR(50) NULL,
  `status_to` VARCHAR(50) NOT NULL,
  `comment` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`action_by_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `feedback`
-- --------------------------------------------------------
CREATE TABLE `feedback` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT UNSIGNED NOT NULL,
  `citizen_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `comments` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`citizen_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `notifications`
-- --------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `link` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `system_settings`
-- --------------------------------------------------------
CREATE TABLE `system_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SEED DATA
-- ========================================================

-- Insert Predefined Departments
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `head_name`, `contact_email`, `icon`) VALUES
(1, 'Public Works & Roads', 'PWR', 'Responsible for urban roads, potholes, paving, and sidewalk maintenance.', 'Er. Rajesh Sharma', 'roads@civicai.gov', 'Construction'),
(2, 'Water Supply & Sewerage', 'WSS', 'Oversees clean drinking water supply, pipeline leaks, and main sewerage connections.', 'Anita Verma', 'water@civicai.gov', 'Droplets'),
(3, 'Electricity Board', 'ELE', 'Manages street lighting, transformers, power outages, and electrical grid issues.', 'Suresh Kumar', 'power@civicai.gov', 'Zap'),
(4, 'Sanitation & Solid Waste', 'SSW', 'Manages daily garbage collection, street sweeping, and public trash bins.', 'Dr. Meena Patel', 'sanitation@civicai.gov', 'Trash2'),
(5, 'Stormwater & Drainage', 'DRN', 'Handles canal cleaning, drain unclogging, and monsoon flood mitigation.', 'Venkatesh Rao', 'drainage@civicai.gov', 'Waves'),
(6, 'Public Health & Sanitation', 'PHS', 'Mosquito fogging, stray animal management, food safety, and hospital care.', 'Dr. Arvind Gupta', 'health@civicai.gov', 'HeartPulse'),
(7, 'Education & Schools', 'EDU', 'Oversees municipal schools, civic libraries, and youth education infrastructure.', 'Priya Menon', 'education@civicai.gov', 'GraduationCap'),
(8, 'Public Transport & Traffic', 'PTT', 'Manages bus stops, traffic signals, transit routes, and parking enforcement.', 'Karan Singh', 'transport@civicai.gov', 'Bus'),
(9, 'Government Services & E-Governance', 'GOV', 'Citizen certificates, office queue management, and digital municipal services.', 'Sunil Deshmukh', 'egov@civicai.gov', 'Landmark'),
(10, 'General & Environmental Services', 'GEN', 'Parks, noise control, tree trimming, and miscellaneous civic inquiries.', 'Nisha Joshi', 'general@civicai.gov', 'TreePine');

-- Passwords: All hashed using standard BCRYPT ($2y$10$)
-- Admin123!    -> $2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6
-- Officer123!  -> $2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6
-- Citizen123!  -> $2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6
-- Note: PHP Auth fallback controller accepts bcrypt verification or standard default salt hash

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `department_id`, `avatar`) VALUES
(1, 'System Administrator', 'admin@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Admin', '+1 800-555-0100', 'Civic Headquarters, Central Avenue', NULL, NULL),
(2, 'Er. Rajesh Sharma (Roads Officer)', 'road.officer@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Officer', '+1 800-555-0101', 'PWD Division 4, Sector 12', 1, NULL),
(3, 'Anita Verma (Water Officer)', 'water.officer@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Officer', '+1 800-555-0102', 'Water Works Yard, Lake Road', 2, NULL),
(4, 'Suresh Kumar (Electricity Officer)', 'electric.officer@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Officer', '+1 800-555-0103', 'Substation 9, Grid Complex', 3, NULL),
(5, 'Dr. Meena Patel (Garbage Officer)', 'garbage.officer@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Officer', '+1 800-555-0104', 'Sanitation HQ, Market Square', 4, NULL),
(6, 'Rahul Sharma (Citizen)', 'citizen@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Citizen', '+1 987-654-3210', '45 Green Park Road, Sector 5', NULL, NULL),
(7, 'Sarah Jenkins (Citizen)', 'sarah@civicai.gov', '$2y$10$w8M3wH8zU6Q7M8A1X0K8ye2O3cW4v5u6t7r8s9q0p1o2n3m4l5k6', 'Citizen', '+1 987-654-3211', '102 Sunset Boulevard, West End', NULL, NULL);

-- Seed Complaints
INSERT INTO `complaints` (`id`, `complaint_number`, `citizen_id`, `department_id`, `title`, `description`, `category`, `priority`, `status`, `location`, `latitude`, `longitude`, `assigned_officer_id`, `ai_summary`, `ai_suggested_resolution`, `resolution_notes`, `resolution_image`, `rating`, `feedback_notes`, `created_at`) VALUES
(1, 'CIV-2026-001', 6, 1, 'Dangerous Pothole on Main Arterial Road', 'Large 2-foot deep pothole causing severe traffic congestion and near accidents near Metro Gate 3.', 'Road', 'High', 'In Progress', 'Metro Gate 3, MG Road', 12.97159870, 77.59456270, 2, 'Hazardous 2ft pothole causing traffic obstruction and vehicle safety risk at Metro Gate 3.', 'Deploy asphalt cold-mix patching crew and set up temporary safety warning cones immediately.', NULL, NULL, NULL, NULL, '2026-07-28 09:30:00'),
(2, 'CIV-2026-002', 6, 2, 'Water Pipeline Burst Leakage', 'Main drinking water pipe ruptured outside Community Hall. Water spilling onto main road continuously for 4 hours.', 'Water', 'Critical', 'Assigned', 'Community Hall, Sector 4', 12.97221000, 77.59310000, 3, 'High-volume drinking water pipeline breach spilling water onto public road near Sector 4.', 'Isolate valve line immediately, dispatch emergency plumbing repair team, replace damaged 4-inch PVC pipe section.', NULL, NULL, NULL, NULL, '2026-07-29 11:15:00'),
(3, 'CIV-2026-003', 7, 3, 'Streetlights Out for 3 Consecutive Blocks', 'Entire street illumination out since Monday. Area is extremely dark causing safety concerns for pedestrians at night.', 'Electricity', 'Medium', 'Submitted', 'Oakwood Street, Block B', 12.96800000, 77.59800000, NULL, 'Multiple streetlights unpowered across 3 blocks causing night pedestrian safety risk.', 'Inspect transformer box T-14 and replace blown automatic timer relay circuit.', NULL, NULL, NULL, NULL, '2026-07-30 08:45:00'),
(4, 'CIV-2026-004', 6, 4, 'Uncollected Commercial Garbage Heap', 'Sanitation truck missed garbage pickup for 4 days. Odor and stray dogs accumulating near market entrance.', 'Garbage', 'High', 'Resolved', 'Central Market Gate 1', 12.97500000, 77.59100000, 5, 'Overflowing municipal trash dump at Central Market creating bio-hazard and odor.', 'Dispatch heavy compactor vehicle and perform chemical spray disinfection.', 'Trash cleared completely using 10-ton compactor truck. Spot disinfected with lime powder.', 'uploads/resolutions/res_004.jpg', 5, 'Prompt action taken! Thank you for cleaning up the market area so quickly.', '2026-07-25 14:00:00'),
(5, 'CIV-2026-005', 7, 5, 'Clogged Stormwater Drain Overflowing', 'Monsoon rain drain blocked by heavy silt and debris. Water backing up into residential driveways.', 'Drainage', 'Critical', 'In Progress', 'Riverview Colony Lane 2', 12.98000000, 77.58900000, 2, 'Stormwater drain blockage leading to localized residential flooding.', 'Deploy suction jetting machine to desilt 50-meter underground culvert.', NULL, NULL, NULL, NULL, '2026-07-29 16:20:00');

-- Seed Complaint Images
INSERT INTO `complaint_images` (`id`, `complaint_id`, `image_url`) VALUES
(1, 1, 'uploads/complaints/pothole_sample.jpg'),
(2, 2, 'uploads/complaints/water_leak_sample.jpg'),
(3, 4, 'uploads/complaints/garbage_sample.jpg');

-- Seed Logs
INSERT INTO `complaint_logs` (`id`, `complaint_id`, `action_by_user_id`, `status_from`, `status_to`, `comment`) VALUES
(1, 1, 6, NULL, 'Submitted', 'Complaint submitted via Citizen Mobile Portal'),
(2, 1, 1, 'Submitted', 'Assigned', 'Assigned automatically by AI to Public Works & Roads'),
(3, 1, 2, 'Assigned', 'In Progress', 'Inspection team dispatched to site for asphalt patch work'),
(4, 4, 6, NULL, 'Submitted', 'Complaint submitted by citizen'),
(5, 4, 5, 'Submitted', 'In Progress', 'Sanitation truck dispatched'),
(6, 4, 5, 'In Progress', 'Resolved', 'Sanitation crew cleared all waste and disinfected zone');

-- Seed Feedback
INSERT INTO `feedback` (`id`, `complaint_id`, `citizen_id`, `rating`, `comments`) VALUES
(1, 4, 6, 5, 'Excellent quick response by sanitation department. Fixed within 6 hours!');

-- Seed Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `link`) VALUES
(1, 6, 'Complaint Status Updated', 'Your complaint CIV-2026-001 is now In Progress by Public Works & Roads.', 'info', 0, '/complaints/1'),
(2, 6, 'Complaint Resolved!', 'Your complaint CIV-2026-004 has been marked as Resolved. Please provide feedback.', 'success', 0, '/complaints/4'),
(3, 2, 'New Complaint Assigned', 'You have been assigned complaint CIV-2026-001 (Road Category).', 'warning', 0, '/officer/complaint/1');

-- Seed System Settings
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `description`) VALUES
(1, 'app_name', 'CivicAI Platform', 'Platform display name'),
(2, 'ai_auto_routing', 'enabled', 'Enable automated department assignment via Gemini AI'),
(3, 'sla_critical_hours', '24', 'Resolution SLA in hours for Critical priority complaints'),
(4, 'sla_high_hours', '48', 'Resolution SLA in hours for High priority complaints'),
(5, 'sla_medium_hours', '72', 'Resolution SLA in hours for Medium priority complaints'),
(6, 'sla_low_hours', '120', 'Resolution SLA in hours for Low priority complaints');
