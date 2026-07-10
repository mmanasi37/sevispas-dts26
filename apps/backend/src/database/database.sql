CREATE DATABASE `sevispass_db`;

CREATE SCHEMA `system_v1`;

CREATE TABLE `Users` (
    id BIGINT PRIMARY KEY;
    phone_number INT;
    email VARCHAR(100);
    created_at TIMESTAMP;
    updated_at TIMESTAMP;
    deleted_at TIMESTAMP;
    deleted_by BIGINT;
    deleted_by BIGINT;
    deleted_by BIGINT;
);

CREATE TABLE `Auth_Provider` (
    id BIGINT PRIMARY KEY;
    phone_number INT;
    email VARCHAR(100);
    created_at TIMESTAMP;
    updated_at TIMESTAMP;
    deleted_at TIMESTAMP;
    deleted_by BIGINT;
    deleted_by BIGINT;
    deleted_by BIGINT;
);

-- Loan
-- LoanApplication
-- LoanStatus
-- LoanHistory
-- Borrower
-- LoanBorrower
-- Staff
-- User
-- Auth_Token
-- Auth_Provider

