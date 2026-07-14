CREATE DATABASE sevispass_db;
CREATE SCHEMA system_v1;

CREATE DATABASE sevispass_db;
CREATE SCHEMA system_v1;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO db_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL PRIVILEGES ON SEQUENCES TO db_admin;


-- loan officers
CREATE TABLE "Staff" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "staff_number" VARCHAR(50),
  "first_name" VARCHAR(100),
  "last_name" VARCHAR(100),
  "role_id" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

CREATE TABLE "Role" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" varchar,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP
);

CREATE TABLE "Permission" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" varchar,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP
);

CREATE TABLE "RoleStaff" (
  "permission_id" INT,
  "staff_id" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP
);

CREATE TABLE "PermissionRole" (
  "permission_id" INT,
  "role_id" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP
);

-- Records types of IDs used when applying for loan
-- SevisPass will be used as one 
CREATE TABLE "IDType" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "id_name" VARCHAR(100),
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

-- Records the borrower
CREATE TABLE "Borrower" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "borrower_number" VARCHAR(50),
  "first_name" VARCHAR(100),
  "last_name" VARCHAR(100),
  "date_of_birth" DATE,
  "id_type_id" INT,
  "id_number" VARCHAR(50),
  "sevispass_id" TEXT NOT NULL UNIQUE,
  "credit_score" INTEGER NOT NULL DEFAULT 0,
  "member_since" TIMESTAMP NOT NULL,
  "phone_number" VARCHAR(20),
  "email" VARCHAR(100),
  "physical_address" TEXT,
  "employment_status" VARCHAR(50),
  "employer" VARCHAR(100),
  "monthly_income" DECIMAL(10,2),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

-- Create BorrowerAccount with foreign key to Borrower table (assuming it exists)
CREATE TABLE "BorrowerAccount" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "account_name" VARCHAR(255) NOT NULL,
    "account_balance" DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    "account_owner_id" INTEGER NOT NULL,
    "date_opened" DATE NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP NULL,
    CONSTRAINT fk_borrower_account_owner 
        FOREIGN KEY (account_owner_id) 
        REFERENCES "Borrower"(id)
        ON DELETE RESTRICT
);

-- Create MainAccounts table
CREATE TABLE "MainAccount" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "account_name" VARCHAR(255) NOT NULL,
    "account_balance" DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP NULL
);

-- Records the loans offered by the bank
CREATE TABLE "Loan" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "loan_number" VARCHAR(50),
  "interest_rate" DECIMAL(5,2),
  "term_months" INT,
  "purpose" TEXT,
  "created_by" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

-- Recrods the application of loans by borrower
CREATE TABLE "LoanApplication" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "borrower_id" INT NOT NULL REFERENCES "Borrower"(id),
  "loan_id" INT,
  "loan_officer_id" INT,
  "loan_amount" DECIMAL(15,2),
  "application_date" DATE,
  -- "application_status" INT,
  "reference" TEXT NOT NULL UNIQUE,
  "term" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "rejection_reason" TEXT,
  "submitted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "decided_at" TIMESTAMP,
  "reviewed_by" INT,
  "review_date" DATE,
  "review_notes" TEXT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

-- Records the types of loan status
CREATE TABLE "LoanStatusType" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "status_name" VARCHAR(100),
  "status_code" VARCHAR(50),
  "status_description" TEXT
);

-- Records the status of the loan
CREATE TABLE "LoanApplicationStatus" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "loan_application_id" INT,
  "loan_status_type_id" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

-- Records the status of the loan
CREATE TABLE "LoanApplicationApproval" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "loan_application_id" INT,
  "reviewed_by" INT,
  "review_date" DATE,
  "review_notes" TEXT,
  "is_reviewd" BOOLEAN,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

CREATE TABLE "LoanRepayment" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "loan_application_id" INTEGER NOT NULL REFERENCES "LoanApplication"(id),
  "due_date" DATE NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "paid_at" TIMESTAMP,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

-- Records the documents provided by the borrower
CREATE TABLE "LoanDocument" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "loan_application_id" INT,
  "document_title" VARCHAR(200),
  "document_file_path" VARCHAR(200),
  "document_description" VARCHAR(200),
  "file_format" VARCHAR(10),
  "borrower_id" INT,
  "uploaded_by" INT,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "deleted_by" INT
);

-- Add foreign key constraints
ALTER TABLE "Staff" ADD FOREIGN KEY ("role_id") REFERENCES "Role" ("id");
ALTER TABLE "Staff" ADD FOREIGN KEY ("deleted_by") REFERENCES "Staff" ("id");
ALTER TABLE "Borrower" ADD FOREIGN KEY ("id_type_id") REFERENCES "IDType" ("id");
ALTER TABLE "Borrower" ADD FOREIGN KEY ("deleted_by") REFERENCES "Staff" ("id");
ALTER TABLE "Loan" ADD FOREIGN KEY ("created_by") REFERENCES "Staff" ("id");
ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("loan_id") REFERENCES "Loan" ("id");
ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("borrower_id") REFERENCES "Borrower" ("id");
ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("loan_officer_id") REFERENCES "Staff" ("id");
ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("reviewed_by") REFERENCES "Staff" ("id");
-- ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("application_status") REFERENCES "LoanApplicationStatus" ("id");
ALTER TABLE "LoanApplication" ADD FOREIGN KEY ("deleted_by") REFERENCES "Staff" ("id");
ALTER TABLE "LoanApplicationStatus" ADD FOREIGN KEY ("loan_application_id") REFERENCES "LoanApplication" ("id");
ALTER TABLE "LoanApplicationStatus" ADD FOREIGN KEY ("loan_status_type_id") REFERENCES "LoanStatusType" ("id");
ALTER TABLE "LoanApplicationApproval" ADD FOREIGN KEY ("loan_application_id") REFERENCES "LoanApplication" ("id");
ALTER TABLE "LoanApplicationApproval" ADD FOREIGN KEY ("reviewed_by") REFERENCES "Staff" ("id");
ALTER TABLE "LoanDocument" ADD FOREIGN KEY ("loan_application_id") REFERENCES "LoanApplication" ("id");
ALTER TABLE "LoanDocument" ADD FOREIGN KEY ("uploaded_by") REFERENCES "Staff" ("id");
ALTER TABLE "LoanDocument" ADD FOREIGN KEY ("deleted_by") REFERENCES "Staff" ("id");
ALTER TABLE "RoleStaff" ADD FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id");
ALTER TABLE "RoleStaff" ADD FOREIGN KEY ("staff_id") REFERENCES "Staff" ("id");
ALTER TABLE "PermissionRole" ADD FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id");
ALTER TABLE "PermissionRole" ADD FOREIGN KEY ("role_id") REFERENCES "Permission" ("id");




-- 2. Role Data
INSERT INTO "Role" ("id", "name", "created_at", "updated_at") VALUES
(1, 'Loan Officer', NOW(), NOW()),
(2, 'Senior Loan Officer', NOW(), NOW()),
(3, 'Branch Manager', NOW(), NOW());

-- 3. Permission Data
INSERT INTO "Permission" ("id", "name", "created_at", "updated_at") VALUES
(1, 'Create Loan Application', NOW(), NOW()),
(2, 'View Loan Application', NOW(), NOW()),
(3, 'Update Loan Application', NOW(), NOW()),
(4, 'Delete Loan Application', NOW(), NOW()),
(5, 'Review Loan Application', NOW(), NOW()),
(6, 'Approve Loan Application', NOW(), NOW()),
(7, 'Create Borrower', NOW(), NOW()),
(8, 'View Borrower', NOW(), NOW()),
(9, 'Create Loan', NOW(), NOW()),
(10, 'View Loan', NOW(), NOW());

INSERT INTO "PermissionRole" ("id", "permission_id", "role_id", "created_at", "updated_at") VALUES
(1, 1, 1, NOW(), NOW()),
(2, 2, 1, NOW(), NOW()),
(3, 3, 1, NOW(), NOW()),
(4, 4, 1, NOW(), NOW()),
(5, 5, 1, NOW(), NOW()),
(6, 6, 1, NOW(), NOW()),
(7, 7, 1, NOW(), NOW()),
(8, 8, 1, NOW(), NOW()),
(9, 9, 1, NOW(), NOW()),
(10, 10, 1, NOW(), NOW());

-- 1. Staff Data (10 staff members)
INSERT INTO "Staff" ("id", "staff_number", "first_name", "last_name", "created_at", "updated_at") VALUES
(1, 'STF001', 'John', 'Smith', NOW(), NOW()),
(2, 'STF002', 'Sarah', 'Johnson', NOW(), NOW()),
(3, 'STF003', 'Michael', 'Williams', NOW(), NOW()),
(4, 'STF004', 'Emily', 'Brown', NOW(), NOW()),
(5, 'STF005', 'David', 'Jones', NOW(), NOW()),
(6, 'STF006', 'Lisa', 'Garcia', NOW(), NOW()),
(7, 'STF007', 'James', 'Miller', NOW(), NOW()),
(8, 'STF008', 'Patricia', 'Davis', NOW(), NOW()),
(9, 'STF009', 'Robert', 'Rodriguez', NOW(), NOW()),
(10, 'STF010', 'Jennifer', 'Martinez', NOW(), NOW());

INSERT INTO "RoleStaff" ("id", "role_id", "staff_id", "created_at", "updated_at") VALUES
(1, 1, 1, NOW(), NOW()),
(2, 2, 2, NOW(), NOW()),
(3, 3, 3, NOW(), NOW()),
(4, 1, 4, NOW(), NOW()),
(5, 2, 5, NOW(), NOW()),
(6, 3, 6, NOW(), NOW()),
(7, 1, 7, NOW(), NOW()),
(8, 2, 8, NOW(), NOW()),
(9, 3, 9, NOW(), NOW()),
(10, 1, 10, NOW(), NOW());

INSERT INTO "IDType" VALUES
(1, 'Drivers License', NOW(), NOW()),
(2, 'National ID', NOW(), NOW()),
(3, 'Employement ID', NOW(), NOW()),
(4, 'Passport', NOW(), NOW()),
(5, 'SevisPass', NOW(), NOW());

-- 4. Borrower Data (10 borrowers)
INSERT INTO "Borrower" ("id", "borrower_number", "first_name", "last_name", "date_of_birth", "id_type_id", "id_number", "phone_number", "email", "physical_address", "employment_status", "employer", "monthly_income", "created_at", "updated_at") VALUES
(1, 'BOR001', 'Alice', 'Johnson', '1985-03-15', 2, 1234567890, 1234567890, 'alice.johnson@email.com', '123 Main St, New York, NY', 'Full Time', 'ABC Corp', 4500.00, NOW(), NOW()),
(2, 'BOR002', 'Bob', 'Smith', '1990-07-22', 1, 1234567890, 2345678901, 'bob.smith@email.com', '456 Oak Ave, Los Angeles, CA', 'Full Time', 'XYZ Ltd', 5200.00, NOW(), NOW()),
(3, 'BOR003', 'Carol', 'Davis', '1988-11-30', 4, 1234567890, 3456789012, 'carol.davis@email.com', '789 Pine St, Chicago, IL', 'Self Employed', 'CD Consulting', 3800.00, NOW(), NOW()),
(4, 'BOR004', 'David', 'Wilson', '1995-05-10', 2, 1234567890, 4567890123, 'david.wilson@email.com', '321 Elm Rd, Houston, TX', 'Part Time', 'Tech Solutions', 3200.00, NOW(), NOW()),
(5, 'BOR005', 'Emma', 'Taylor', '1983-09-18', 5, 1234567890, 5678901234, 'emma.taylor@email.com', '654 Cedar Ln, Phoenix, AZ', 'Full Time', 'Global Inc', 6000.00, NOW(), NOW()),
(6, 'BOR006', 'Frank', 'Brown', '1992-12-05', 1, 1234567890, 6789012345, 'frank.brown@email.com', '987 Birch Dr, Philadelphia, PA', 'Full Time', 'Brown Enterprises', 4800.00, NOW(), NOW()),
(7, 'BOR007', 'Grace', 'Martinez', '1987-06-25', 3, 1234567890, 7890123456, 'grace.martinez@email.com', '147 Spruce Way, San Antonio, TX', 'Self Employed', 'GM Design', 4100.00, NOW(), NOW()),
(8, 'BOR008', 'Henry', 'Anderson', '1993-08-14', 2, 1234567890, 8901234567, 'henry.anderson@email.com', '258 Willow Ct, San Diego, CA', 'Full Time', 'National Bank', 5500.00, NOW(), NOW()),
(9, 'BOR009', 'Irene', 'Thomas', '1986-04-02', 4, 1234567890, 9012345678, 'irene.thomas@email.com', '369 Maple St, Dallas, TX', 'Part Time', 'IT Services', 2900.00, NOW(), NOW()),
(10, 'BOR010', 'Jack', 'White', '1991-10-19', 1, 1234567890, 1234509876, 'jack.white@email.com', '741 Ash Blvd, San Jose, CA', 'Full Time', 'White Holdings', 6500.00, NOW(), NOW());

-- 5. Loan Data (10 loan products)
INSERT INTO "Loan" ("id", "loan_number", "interest_rate", "term_months", "purpose", "created_by", "created_at", "updated_at") VALUES
(1, 'LN001', 8.50, 12, 'Personal Loan - Short Term', 1, NOW(), NOW()),
(2, 'LN002', 10.00, 24, 'Home Improvement Loan', 2, NOW(), NOW()),
(3, 'LN003', 7.50, 36, 'Auto Loan', 3, NOW(), NOW()),
(4, 'LN004', 12.00, 12, 'Business Startup Loan', 1, NOW(), NOW()),
(5, 'LN005', 9.00, 48, 'Education Loan', 2, NOW(), NOW()),
(6, 'LN006', 11.50, 60, 'Mortgage Loan', 3, NOW(), NOW()),
(7, 'LN007', 6.50, 12, 'Bridge Loan', 1, NOW(), NOW()),
(8, 'LN008', 13.00, 24, 'Debt Consolidation Loan', 2, NOW(), NOW()),
(9, 'LN009', 8.00, 36, 'Medical Emergency Loan', 3, NOW(), NOW()),
(10, 'LN010', 10.50, 18, 'Vacation Loan', 1, NOW(), NOW());

-- 6. LoanStatusType Data
INSERT INTO "LoanStatusType" ("id", "status_name", "status_code", "status_description") VALUES
(1, 'Pending Review', 'PENDING', 'Loan application submitted and awaiting review'),
(2, 'Under Review', 'REVIEWING', 'Loan application is being reviewed by loan officer'),
(3, 'Approved', 'APPROVED', 'Loan application has been approved'),
(4, 'Rejected', 'REJECTED', 'Loan application has been rejected'),
(5, 'Disbursed', 'DISBURSED', 'Loan amount has been disbursed to borrower'),
(6, 'Active', 'ACTIVE', 'Loan is active and being repaid'),
(7, 'Completed', 'COMPLETED', 'Loan has been fully repaid'),
(8, 'Defaulted', 'DEFAULTED', 'Borrower has defaulted on loan'),
(9, 'Cancelled', 'CANCELLED', 'Loan application was cancelled by borrower'),
(10, 'On Hold', 'ON_HOLD', 'Loan application is temporarily on hold');

-- 8. LoanApplicationStatus Data
INSERT INTO "LoanApplicationStatus" ("id", "loan_application_id", "loan_status_type_id", "created_at", "updated_at") VALUES
(1, 1, 1, '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
(2, 1, 3, '2026-01-12 14:30:00', '2026-01-12 14:30:00'),
(3, 2, 1, '2026-01-15 09:15:00', '2026-01-15 09:15:00'),
(4, 2, 4, '2026-01-18 11:45:00', '2026-01-18 11:45:00'),
(5, 3, 1, '2026-01-20 13:00:00', '2026-01-20 13:00:00'),
(6, 3, 3, '2026-01-22 16:20:00', '2026-01-22 16:20:00'),
(7, 4, 1, '2026-01-25 08:30:00', '2026-01-25 08:30:00'),
(8, 5, 1, '2026-02-01 10:00:00', '2026-02-01 10:00:00'),
(9, 5, 2, '2026-02-03 15:00:00', '2026-02-03 15:00:00'),
(10, 6, 1, '2026-02-05 11:30:00', '2026-02-05 11:30:00');

-- 7. LoanApplication Data (10 applications)
INSERT INTO "LoanApplication" ("id", "borrower_id", "loan_id", "loan_officer_id", "loan_amount", "application_date", "reviewed_by", "review_date", "review_notes", "created_at", "updated_at") VALUES
(1, 1, 1, 1, 15000.00, '2026-01-10', 1, '2026-01-12', 'Approved - Good credit score', NOW(), NOW()),
(2, 2, 3, 2, 25000.00, '2026-01-15', 2, '2026-01-18', 'Rejected - Insufficient income', NOW(), NOW()),
(3, 3, 2, 3, 35000.00, '2026-01-20', 3, '2026-01-22', 'Approved - Excellent collateral', NOW(), NOW()),
(4, 4, 4, 1, 10000.00, '2026-01-25', NULL, NULL, NULL, NOW(), NOW()),
(5, 5, 5, 2, 30000.00, '2026-02-01', 2, '2026-02-03', 'Verifying employment details', NOW(), NOW()),
(6, 6, 6, 3, 200000.00, '2026-02-05', 3, '2026-02-08', 'Approved - Property valuation confirmed', NOW(), NOW()),
(7, 7, 7, 1, 18000.00, '2026-02-10', 1, '2026-02-12', 'Rejected - High debt-to-income ratio', NOW(), NOW()),
(8, 8, 8, 2, 50000.00, '2026-02-15', NULL, NULL, NULL, NOW(), NOW()),
(9, 9, 9, 3, 12000.00, '2026-02-20', 3, '2026-02-22', 'Approved - Medical emergency verified', NOW(), NOW()),
(10, 10, 10, 1, 22000.00, '2026-02-25', 1, '2026-02-27', 'Reviewing credit history', NOW(), NOW());


-- 9. LoanApplicationApproval Data
INSERT INTO "LoanApplicationApproval" ("id", "loan_application_id", "reviewed_by", "review_date", "review_notes", "is_reviewd", "created_at", "updated_at") VALUES
(1, 1, 1, '2026-01-12', 'Applicant has good credit history. Income verified. Approval recommended.', TRUE, NOW(), NOW()),
(2, 2, 2, '2026-01-18', 'Monthly income too low for requested amount. Additional collateral required.', TRUE, NOW(), NOW()),
(3, 3, 3, '2026-01-22', 'Property valuation satisfactory. Income documents verified. Approved.', TRUE, NOW(), NOW()),
(4, 4, NULL, NULL, NULL, FALSE, NOW(), NOW()),
(5, 5, 2, '2026-02-03', 'Verifying employment. Awaiting additional documentation.', TRUE, NOW(), NOW()),
(6, 6, 3, '2026-02-08', 'Appraisal completed. All documents in order. Approved.', TRUE, NOW(), NOW()),
(7, 7, 1, '2026-02-12', 'Debt-to-income ratio exceeds acceptable threshold. Rejected.', TRUE, NOW(), NOW()),
(8, 8, NULL, NULL, NULL, FALSE, NOW(), NOW()),
(9, 9, 3, '2026-02-22', 'Medical emergency verified. Documentation complete. Approved.', TRUE, NOW(), NOW()),
(10, 10, 1, '2026-02-27', 'Credit history review in progress.', TRUE, NOW(), NOW());

-- 10. LoanDocument Data
INSERT INTO "LoanDocument" ("id", "loan_application_id", "document_title", "document_file_path", "document_description", "file_format", "borrower_id", "uploaded_by", "created_at", "updated_at") VALUES
(1, 1, 'ID Proof', '/documents/borrower_1/id_proof.pdf', 'Copy of National ID', 'pdf', 1, 1, NOW(), NOW()),
(2, 1, 'Income Statement', '/documents/borrower_1/income_statement.pdf', 'Last 3 months pay stubs', 'pdf', 1, 1, NOW(), NOW()),
(3, 2, 'Drivers License', '/documents/borrower_2/license.pdf', 'Valid drivers license', 'pdf', 2, 2, NOW(), NOW()),
(4, 3, 'Property Deed', '/documents/borrower_3/property_deed.pdf', 'Property ownership document', 'pdf', 3, 3, NOW(), NOW()),
(5, 4, 'Bank Statement', '/documents/borrower_4/bank_statement.pdf', 'Last 6 months bank statements', 'pdf', 4, 1, NOW(), NOW()),
(6, 5, 'Employment Letter', '/documents/borrower_5/employment_letter.pdf', 'Letter from employer', 'pdf', 5, 2, NOW(), NOW()),
(7, 6, 'Property Appraisal', '/documents/borrower_6/appraisal.pdf', 'Property appraisal report', 'pdf', 6, 3, NOW(), NOW()),
(8, 7, 'Tax Returns', '/documents/borrower_7/tax_returns.pdf', 'Last 2 years tax returns', 'pdf', 7, 1, NOW(), NOW()),
(9, 8, 'Business License', '/documents/borrower_8/business_license.pdf', 'Business registration document', 'pdf', 8, 2, NOW(), NOW()),
(10, 9, 'Medical Records', '/documents/borrower_9/medical_records.pdf', 'Medical emergency documentation', 'pdf', 9, 3, NOW(), NOW());
