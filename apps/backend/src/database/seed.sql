-- 1. Role Data
INSERT INTO "Role" ("id", "name", "created_at", "updated_at") VALUES
(1, 'Loan Officer', NOW(), NOW()),
(2, 'Senior Loan Officer', NOW(), NOW()),
(3, 'Branch Manager', NOW(), NOW());

-- 2. Permission Data
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

-- 3. PermissionRole Data
INSERT INTO "PermissionRole" ("permission_id", "role_id", "created_at", "updated_at") VALUES
(1, 1, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(3, 1, NOW(), NOW()),
(4, 1, NOW(), NOW()),
(5, 1, NOW(), NOW()),
(6, 1, NOW(), NOW()),
(7, 1, NOW(), NOW()),
(8, 1, NOW(), NOW()),
(9, 1, NOW(), NOW()),
(10, 1, NOW(), NOW());

-- 4. Staff Data (10 staff members)
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

-- 5. RoleStaff Data
INSERT INTO "RoleStaff" ("role_id", "staff_id", "created_at", "updated_at") VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(1, 4, NOW(), NOW()),
(2, 5, NOW(), NOW()),
(3, 6, NOW(), NOW()),
(1, 7, NOW(), NOW()),
(2, 8, NOW(), NOW()),
(3, 9, NOW(), NOW()),
(1, 10, NOW(), NOW());

-- 6. IDType Data
INSERT INTO "IDType" VALUES
(1, 'Drivers License', NOW(), NOW()),
(2, 'National ID', NOW(), NOW()),
(3, 'Employement ID', NOW(), NOW()),
(4, 'Passport', NOW(), NOW()),
(5, 'SevisPass', NOW(), NOW());

-- 7. Borrower Data (10 borrowers)
INSERT INTO "Borrower" ("id", "borrower_number", "first_name", "last_name", "date_of_birth", "id_type_id", "id_number", "sevispass_id", "member_since", "phone_number", "email", "physical_address", "employment_status", "employer", "monthly_income", "created_at", "updated_at") VALUES
(1, 'BOR001', 'Alice', 'Johnson', '1985-03-15', 2, '1234567890', 'sp-001', '2026-01-01', '1234567890', 'alice.johnson@email.com', '123 Main St, New York, NY', 'Full Time', 'ABC Corp', 4500.00, NOW(), NOW()),
(2, 'BOR002', 'Bob', 'Smith', '1990-07-22', 1, '1234567891', 'sp-002', '2026-01-01', '2345678901', 'bob.smith@email.com', '456 Oak Ave, Los Angeles, CA', 'Full Time', 'XYZ Ltd', 5200.00, NOW(), NOW()),
(3, 'BOR003', 'Carol', 'Davis', '1988-11-30', 4, '1234567892', 'sp-003', '2026-01-01', '3456789012', 'carol.davis@email.com', '789 Pine St, Chicago, IL', 'Self Employed', 'CD Consulting', 3800.00, NOW(), NOW()),
(4, 'BOR004', 'David', 'Wilson', '1995-05-10', 2, '1234567893', 'sp-004', '2026-01-01', '4567890123', 'david.wilson@email.com', '321 Elm Rd, Houston, TX', 'Part Time', 'Tech Solutions', 3200.00, NOW(), NOW()),
(5, 'BOR005', 'Emma', 'Taylor', '1983-09-18', 5, '1234567894', 'sp-005', '2026-01-01', '5678901234', 'emma.taylor@email.com', '654 Cedar Ln, Phoenix, AZ', 'Full Time', 'Global Inc', 6000.00, NOW(), NOW()),
(6, 'BOR006', 'Frank', 'Brown', '1992-12-05', 1, '1234567895', 'sp-006', '2026-01-01', '6789012345', 'frank.brown@email.com', '987 Birch Dr, Philadelphia, PA', 'Full Time', 'Brown Enterprises', 4800.00, NOW(), NOW()),
(7, 'BOR007', 'Grace', 'Martinez', '1987-06-25', 3, '1234567896', 'sp-007', '2026-01-01', '7890123456', 'grace.martinez@email.com', '147 Spruce Way, San Antonio, TX', 'Self Employed', 'GM Design', 4100.00, NOW(), NOW()),
(8, 'BOR008', 'Henry', 'Anderson', '1993-08-14', 2, '1234567897', 'sp-008', '2026-01-01', '8901234567', 'henry.anderson@email.com', '258 Willow Ct, San Diego, CA', 'Full Time', 'National Bank', 5500.00, NOW(), NOW()),
(9, 'BOR009', 'Irene', 'Thomas', '1986-04-02', 4, '1234567898', 'sp-009', '2026-01-01', '9012345678', 'irene.thomas@email.com', '369 Maple St, Dallas, TX', 'Part Time', 'IT Services', 2900.00, NOW(), NOW()),
(10, 'BOR010', 'Jack', 'White', '1991-10-19', 1, '1234567899', 'sp-010', '2026-01-01', '1234509876', 'jack.white@email.com', '741 Ash Blvd, San Jose, CA', 'Full Time', 'White Holdings', 6500.00, NOW(), NOW());

-- 8. BorrowerAccount Data
INSERT INTO "BorrowerAccount" ("id", "account_name", "account_number", "account_balance", "account_owner_id", "account_type_id", "date_opened", "created_at", "updated_at") VALUES
(1, 'Alice Main Checking', '1234567890', 5000.00, 1, 1, '2026-01-01', NOW(), NOW()),
(2, 'Bob Savings', '1234567891', 12000.00, 2, 2, '2026-01-01', NOW(), NOW()),
(3, 'Carol Personal Account', '1234567892', 3500.00, 3, 1, '2026-01-01', NOW(), NOW());

-- 9. Loan Data (10 loan products)
INSERT INTO "Loan" ("id", "loan_name", "loan_description", "min_amount", "max_amount", "min_term", "max_term", "interest_rate", "created_by", "created_at", "updated_at") VALUES
(1, 'Personal Loan', 'Personal Loan - Short Term', 500.00, 10000.00, 1, 12, 8.50, 1, NOW(), NOW()),
(2, 'Home Improvement Loan', 'Home Improvement Loan', 1000.00, 50000.00, 6, 24, 10.00, 2, NOW(), NOW()),
(3, 'Auto Loan', 'Auto Loan', 5000.00, 75000.00, 12, 60, 7.50, 3, NOW(), NOW()),
(4, 'Business Startup Loan', 'Business Startup Loan', 5000.00, 100000.00, 12, 60, 12.00, 1, NOW(), NOW()),
(5, 'Education Loan', 'Education Loan', 1000.00, 30000.00, 12, 48, 9.00, 2, NOW(), NOW()),
(6, 'Mortgage Loan', 'Mortgage Loan', 50000.00, 500000.00, 60, 360, 11.50, 3, NOW(), NOW()),
(7, 'Bridge Loan', 'Bridge Loan', 10000.00, 250000.00, 1, 12, 6.50, 1, NOW(), NOW()),
(8, 'Debt Consolidation Loan', 'Debt Consolidation Loan', 5000.00, 50000.00, 12, 60, 13.00, 2, NOW(), NOW()),
(9, 'Medical Emergency Loan', 'Medical Emergency Loan', 500.00, 20000.00, 3, 36, 8.00, 3, NOW(), NOW()),
(10, 'Vacation Loan', 'Vacation Loan', 500.00, 10000.00, 3, 18, 10.50, 1, NOW(), NOW());

-- 10. LoanStatusType Data
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

-- 11. LoanApplication Data (10 applications)
INSERT INTO "LoanApplication" (
  "id", "borrower_id", "loan_id", "loan_officer_id", "loan_amount", 
  "application_date", "reference", "purpose", "status", "rejection_reason", 
  "decided_at", "reviewed_by", "review_date", "review_notes", "created_at", "updated_at"
) VALUES
(1, 1, 1, 1, 15000.00, '2026-01-10', 'REF-001', 'Personal Loan', 'approved', NULL, '2026-01-12', 1, '2026-01-12', 'Approved - Good credit score', NOW(), NOW()),
(2, 2, 3, 2, 25000.00, '2026-01-15', 'REF-002', 'Auto Loan', 'rejected', 'Insufficient income', '2026-01-18', 2, '2026-01-18', 'Rejected - Insufficient income', NOW(), NOW()),
(3, 3, 2, 3, 35000.00, '2026-01-20', 'REF-003', 'Home Improvement', 'approved', NULL, '2026-01-22', 3, '2026-01-22', 'Approved - Excellent collateral', NOW(), NOW()),
(4, 4, 4, 1, 10000.00, '2026-01-25', 'REF-004', 'Business Startup', 'pending', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(5, 5, 5, 2, 30000.00, '2026-02-01', 'REF-005', 'Education Loan', 'pending', NULL, NULL, 2, '2026-02-03', 'Verifying employment details', NOW(), NOW()),
(6, 6, 6, 3, 200000.00, '2026-02-05', 'REF-006', 'Mortgage Loan', 'approved', NULL, '2026-02-08', 3, '2026-02-08', 'Approved - Property valuation confirmed', NOW(), NOW()),
(7, 7, 7, 1, 18000.00, '2026-02-10', 'REF-007', 'Bridge Loan', 'rejected', 'High debt-to-income ratio', '2026-02-12', 1, '2026-02-12', 'Rejected - High debt-to-income ratio', NOW(), NOW()),
(8, 8, 8, 2, 50000.00, '2026-02-15', 'REF-008', 'Debt Consolidation', 'pending', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(9, 9, 9, 3, 12000.00, '2026-02-20', 'REF-009', 'Medical Emergency', 'approved', NULL, '2026-02-22', 3, '2026-02-22', 'Approved - Medical emergency verified', NOW(), NOW()),
(10, 10, 10, 1, 22000.00, '2026-02-25', 'REF-010', 'Vacation Loan', 'pending', NULL, NULL, 1, '2026-02-27', 'Reviewing credit history', NOW(), NOW());

-- 12. LoanApplicationStatus Data
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

-- 13. LoanApplicationApproval Data
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

-- 14. LoanRepayment Data
INSERT INTO "LoanRepayment" ("id", "loan_application_id", "due_date", "next_due_date", "amount", "status", "paid_at", "created_at", "updated_at") VALUES
(1, 1, '2026-02-10', '2026-03-10', 1250, 'paid', '2026-02-09 10:00:00', NOW(), NOW()), 
(2, 1, '2026-03-10', '2026-04-10', 1250, 'pending', NULL, NOW(), NOW()),
(3, 3, '2026-02-20', '2026-03-20', 972, 'paid', '2026-02-19 14:00:00', NOW(), NOW());

-- 15. LoanDocument Data
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
