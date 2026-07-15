-- CREATE DATABASE sevispass_db;
-- CREATE SCHEMA system_v1;

-- CREATE DATABASE sevispass_db;
-- CREATE SCHEMA system_v1;

-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT ALL PRIVILEGES ON TABLES TO db_admin;

-- ALTER DEFAULT PRIVILEGES IN SCHEMA public 
-- GRANT ALL PRIVILEGES ON SEQUENCES TO db_admin;


-- loan officers
CREATE TABLE `Staff` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `staff_number` VARCHAR(50),
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(100),
  `password` VARCHAR(100),
  `phone_number` INT,
  `gender` VARCHAR(10),
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP,
  `deleted_by` INT
);

CREATE TABLE `Role` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` varchar,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP
);

CREATE TABLE `Permission` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` varchar,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP
);

CREATE TABLE `RoleStaff` (
  `role_id` INT,
  `staff_id` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP
);

CREATE TABLE `PermissionRole` (
  `permission_id` INT,
  `role_id` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP
);

-- Records types of IDs used when applying for loan
-- SevisPass will be used as one 
CREATE TABLE `IDType` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_name` VARCHAR(100),
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

-- Records the borrower details
CREATE TABLE `Borrower` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `borrower_number` VARCHAR(50),
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `id_type_id` INTEGER NOT NULL,
  `id_number` VARCHAR(50) NOT NULL UNIQUE,
  `sevispass_id` VARCHAR(200) UNIQUE NOT NULL,
  `credit_score` INTEGER NOT NULL DEFAULT 0,
  `member_since` DATE NOT NULL,
  `phone_number` VARCHAR(20),
  `email` VARCHAR(100),
  `physical_address` TEXT,
  `employment_status` VARCHAR(50),
  `employer_name` VARCHAR(100),
  `monthly_income` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP,
  `deleted_by` INTEGER
);

-- Create BorrowerAccount with foreign key to Borrower table (assuming it exists)
CREATE TABLE `BorrowerAccount` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `account_name` varchar(255) NOT NULL,
  `account_number` varchar(50) UNIQUE NOT NULL,
  `account_balance` decimal(15,2) NOT NULL DEFAULT 0,
  `account_owner_id` int NOT NULL,
  `account_type_id` int NOT NULL,
  `date_opened` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  CONSTRAINT fk_borrower_account_owner 
      FOREIGN KEY (account_owner_id) 
      REFERENCES `Borrower`(id)
      ON DELETE RESTRICT
);

-- Records the loans offered by the bank
CREATE TABLE `Loan` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `loan_name` VARCHAR(50),
  `loan_description` TEXT,
  `min_amount` DECIMAL(15,2),
  `max_amount` DECIMAL(15,2),
  `min_term` INT,
  `max_term` INT,
  `interest_rate` DECIMAL(5,2),
  `created_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

-- Recrods the application of loans by borrower

CREATE TABLE `LoanApplication` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `borrower_id` INT NOT NULL,
  `loan_id` INT,
  `loan_officer_id` INT,
  `loan_amount` DECIMAL(15,2),
  `application_date` DATE,
  `reference` TEXT UNIQUE NOT NULL,
  `purpose` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `rejection_reason` TEXT,
  `submitted_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `decided_at` TIMESTAMP,
  `reviewed_by` INT,
  `review_date` DATE,
  `review_notes` TEXT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP,
  `deleted_by` INT
);

-- Records the types of loan status
CREATE TABLE `LoanStatusType` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `status_name` VARCHAR(100),
  `status_code` VARCHAR(50),
  `status_description` TEXT
);

-- Records the status of the loan
CREATE TABLE `LoanApplicationStatus` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` INT,
  `loan_status_type_id` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

-- Records the status of the loan
CREATE TABLE `LoanApplicationApproval` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` INT,
  `reviewed_by` INT,
  `review_date` DATE,
  `review_notes` TEXT,
  `is_reviewd` BOOLEAN,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

-- Records the repayment of loans
CREATE TABLE `LoanRepayment` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` INTEGER NOT NULL REFERENCES `LoanApplication`(id),
  `due_date` DATE NOT NULL,
  `next_due_date` DATE NOT NULL,
  `amount` INTEGER NOT NULL,
  `status` TEXT NOT NULL DEFAULT 'pending',
  `paid_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

-- Records the documents provided by the borrower
CREATE TABLE `LoanDocument` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `loan_application_id` INT,
  `document_title` VARCHAR(200),
  `document_file_path` VARCHAR(200),
  `document_description` VARCHAR(200),
  `file_format` VARCHAR(10),
  `borrower_id` INT,
  `uploaded_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` TIMESTAMP,
  `deleted_by` INT
);

-- Add foreign key constraints
ALTER TABLE `Staff` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);
ALTER TABLE `Staff` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `Borrower` ADD FOREIGN KEY (`id_type_id`) REFERENCES `IDType` (`id`);
ALTER TABLE `Borrower` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `BorrowerAccount` ADD FOREIGN KEY (`account_owner_id`) REFERENCES `Borrower` (`id`);
ALTER TABLE `BorrowerAccount` ADD FOREIGN KEY (`account_type_id`) REFERENCES `AccountType` (`id`);
ALTER TABLE `Loan` ADD FOREIGN KEY (`created_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`loan_id`) REFERENCES `Loan` (`id`);
ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`borrower_id`) REFERENCES `Borrower` (`id`);
ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`loan_officer_id`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`reviewed_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanApplication` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanApplicationStatus` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);
ALTER TABLE `LoanApplicationStatus` ADD FOREIGN KEY (`loan_status_type_id`) REFERENCES `LoanStatusType` (`id`);
ALTER TABLE `LoanApplicationApproval` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);
ALTER TABLE `LoanApplicationApproval` ADD FOREIGN KEY (`reviewed_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanRepayment` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);
ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`loan_application_id`) REFERENCES `LoanApplication` (`id`);
ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`borrower_id`) REFERENCES `Borrower` (`id`);
ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`uploaded_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `LoanDocument` ADD FOREIGN KEY (`deleted_by`) REFERENCES `Staff` (`id`);
ALTER TABLE `RoleStaff` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);
ALTER TABLE `RoleStaff` ADD FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`id`);
ALTER TABLE `PermissionRole` ADD FOREIGN KEY (`permission_id`) REFERENCES `Permission` (`id`);
ALTER TABLE `PermissionRole` ADD FOREIGN KEY (`role_id`) REFERENCES `Permission` (`id`);
