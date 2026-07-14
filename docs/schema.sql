-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: MySQL
-- Generated at: 2026-07-14T09:42:17.182Z

CREATE TABLE `Staff` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `staff_number` varchar(50),
  `first_name` varchar(100),
  `last_name` varchar(100),
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp,
  `deleted_by` int
);

CREATE TABLE `Role` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `Permission` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `RoleStaff` (
  `role_id` int,
  `staff_id` int,
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `PermissionRole` (
  `permission_id` int,
  `role_id` int,
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `IDType` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_name` varchar(100),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Borrower` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `borrower_number` varchar(50),
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_of_birth` date NOT NULL,
  `id_type_id` int NOT NULL,
  `id_number` varchar(50) UNIQUE NOT NULL,
  `sevispass_id` varchar(200) UNIQUE NOT NULL,
  `credit_score` int NOT NULL DEFAULT 0,
  `member_since` date NOT NULL,
  `phone_number` varchar(20),
  `email` varchar(100),
  `physical_address` text,
  `employment_status` varchar(50),
  `employer_name` varchar(100),
  `monthly_income` decimal(10,2),
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` timestamp,
  `deleted_at` timestamp,
  `deleted_by` int
);

CREATE TABLE `AccountType` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50),
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `BorrowerAccount` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `account_name` varchar(255) NOT NULL,
  `account_number` varchar(50) UNIQUE NOT NULL,
  `account_balance` decimal(15,2) NOT NULL DEFAULT 0,
  `account_owner_id` int NOT NULL,
  `account_type_id` int NOT NULL,
  `date_opened` date NOT NULL,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `deleted_at` timestamp
);

CREATE TABLE `Loan` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `loan_name` varchar(50),
  `loan_description` text,
  `min_amount` decimal(15,2),
  `max_amount` decimal(15,2),
  `min_term` int,
  `max_term` int,
  `interest_rate` decimal(5,2),
  `created_by` int,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `LoanApplication` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `borrower_id` int NOT NULL,
  `loan_id` int,
  `loan_officer_id` int,
  `loan_amount` decimal(15,2),
  `application_date` date,
  `reference` text UNIQUE NOT NULL,
  `term` text NOT NULL,
  `purpose` text NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `rejection_reason` text,
  `submitted_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `decided_at` timestamp,
  `reviewed_by` int,
  `review_date` date,
  `review_notes` text,
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp,
  `deleted_by` int
);

CREATE TABLE `LoanStatusType` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `status_name` varchar(100),
  `status_code` varchar(50),
  `status_description` text
);

CREATE TABLE `LoanApplicationStatus` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` int,
  `loan_status_type_id` int,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `LoanApplicationApproval` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` int,
  `reviewed_by` int,
  `review_date` date,
  `review_notes` text,
  `is_reviewd` boolean,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `LoanRepayment` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` int NOT NULL,
  `due_date` date NOT NULL,
  `amount` int NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `paid_at` timestamp,
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp,
  `deleted_by` int
);

CREATE TABLE `LoanDocument` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` int,
  `document_title` varchar(200),
  `document_file_path` varchar(200),
  `document_description` varchar(200),
  `file_format` varchar(10),
  `borrower_id` int,
  `uploaded_by` int,
  `created_at` timestamp,
  `updated_at` timestamp,
  `deleted_at` timestamp,
  `deleted_by` int
);

ALTER TABLE `Staff` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `RoleStaff` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);

ALTER TABLE `RoleStaff` ADD FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`id`);

ALTER TABLE `PermissionRole` ADD FOREIGN KEY (`permission_id`) REFERENCES `Permission` (`id`);

ALTER TABLE `PermissionRole` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);

ALTER TABLE `Borrower` ADD FOREIGN KEY (`id_type_id`) REFERENCES `IDType` (`id`);

ALTER TABLE `Borrower` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `BorrowerAccount` ADD FOREIGN KEY (`account_owner_id`) REFERENCES `Borrower` (`id`);

ALTER TABLE `BorrowerAccount` ADD FOREIGN KEY (`account_type_id`) REFERENCES `AccountType` (`id`);

ALTER TABLE `Loan` ADD FOREIGN KEY (`created_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`borrower_id`) REFERENCES `Borrower` (`id`);

ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`loan_id`) REFERENCES `Loan` (`id`);

ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`loan_officer_id`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`reviewed_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanApplicationStatus` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);

ALTER TABLE `LoanApplicationStatus` ADD FOREIGN KEY (`loan_status_type_id`) REFERENCES `LoanStatusType` (`id`);

ALTER TABLE `LoanApplicationApproval` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);

ALTER TABLE `LoanApplicationApproval` ADD FOREIGN KEY (`reviewed_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanRepayment` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);

ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);

ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`uploaded_by`) REFERENCES `Staff` (`id`);

ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);
