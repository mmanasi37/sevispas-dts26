import path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import { Kysely, PostgresDialect } from 'kysely'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import type { Database } from './schema.ts'
import { db } from './index.ts';
import { libsqlClient as client } from './index.ts';
// import { mysqlDialect as client } from './index.ts';

const statements = [
  // `CREATE TABLE IF NOT EXISTS borrowers (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       sevispass_id TEXT NOT NULL UNIQUE,
  //       first_name TEXT NOT NULL,
  //       last_name TEXT NOT NULL,
  //       email TEXT,
  //       credit_score INTEGER NOT NULL DEFAULT 0,
  //       member_since TEXT NOT NULL,
  //       created_at TEXT NOT NULL DEFAULT (datetime('now'))
  //   )`,
  // `CREATE TABLE IF NOT EXISTS loan_applications (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       reference TEXT NOT NULL UNIQUE,
  //       borrower_id INTEGER NOT NULL REFERENCES borrowers(id),
  //       amount INTEGER NOT NULL,
  //       term TEXT NOT NULL,
  //       purpose TEXT NOT NULL,
  //       status TEXT NOT NULL DEFAULT 'pending',
  //       rejection_reason TEXT,
  //       submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  //       decided_at TEXT
  //   )`,
  // `CREATE TABLE IF NOT EXISTS repayments (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       loan_application_id INTEGER NOT NULL REFERENCES loan_applications(id),
  //       due_date TEXT NOT NULL,
  //       next_due_date TEXT NOT NULL,
  //       amount INTEGER NOT NULL,
  //       status TEXT NOT NULL DEFAULT 'pending',
  //       paid_at TEXT
  //   )`,

  `CREATE TABLE Role (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name varchar(255) NOT NULL UNIQUE,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);`,

  `CREATE TABLE Permission (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name varchar(255) NOT NULL UNIQUE,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);`,

  `CREATE TABLE RoleStaff (
  role_id int NOT NULL,
  staff_id int NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  PRIMARY KEY (role_id, staff_id),
  FOREIGN KEY (role_id) REFERENCES Role(id),
  FOREIGN KEY (staff_id) REFERENCES Staff(id)
);`,

  `CREATE TABLE PermissionRole (
  permission_id int NOT NULL,
  role_id int NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  PRIMARY KEY (permission_id, role_id),
  FOREIGN KEY (permission_id) REFERENCES Permission(id),
  FOREIGN KEY (role_id) REFERENCES Role(id)
);`,

  `CREATE TABLE Staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_number varchar(50) NOT NULL UNIQUE,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  deleted_by int,
  FOREIGN KEY (deleted_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE IDType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_name varchar(100) NOT NULL UNIQUE,
  created_at timestamp,
  updated_at timestamp
);`,

  `CREATE TABLE Borrower (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  borrower_number varchar(50) NOT NULL UNIQUE,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  date_of_birth date NOT NULL,
  id_type_id INTEGER NOT NULL,
  id_number varchar(50) UNIQUE NOT NULL,
  sevispass_id varchar(200) UNIQUE NOT NULL,
  credit_score INTEGER NOT NULL DEFAULT 0 CHECK (credit_score >= 0),
  member_since date NOT NULL,
  phone_number varchar(20),
  email varchar(100) UNIQUE,
  physical_address text,
  employment_status varchar(50),
  employer_name varchar(100),
  monthly_income decimal(10,2) CHECK (monthly_income >= 0),
  village text,
  province text,
  created_at timestamp DEFAULT (CURRENT_TIMESTAMP),
  updated_at timestamp,
  deleted_at timestamp,
  deleted_by int,
  FOREIGN KEY (id_type_id) REFERENCES IDType(id),
  FOREIGN KEY (deleted_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE AccountType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name varchar(50) NOT NULL UNIQUE,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);`,

  `CREATE TABLE BorrowerAccount (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name varchar(255) NOT NULL,
  account_number varchar(50) UNIQUE NOT NULL,
  account_balance decimal(15,2) NOT NULL DEFAULT 0 CHECK (account_balance >= 0),
  account_owner_id INTEGER NOT NULL,
  account_type_id INTEGER NOT NULL,
  date_opened date NOT NULL,
  created_at timestamp DEFAULT (CURRENT_TIMESTAMP),
  updated_at timestamp DEFAULT (CURRENT_TIMESTAMP),
  deleted_at timestamp,
  FOREIGN KEY (account_owner_id) REFERENCES Borrower(id),
  FOREIGN KEY (account_type_id) REFERENCES AccountType(id)
);`,

  `CREATE TABLE Loan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_name varchar(50) NOT NULL UNIQUE,
  loan_description text,
  min_amount decimal(15,2) NOT NULL CHECK (min_amount >= 0),
  max_amount decimal(15,2) NOT NULL CHECK (max_amount >= min_amount),
  min_term int NOT NULL CHECK (min_term > 0),
  max_term int NOT NULL CHECK (max_term >= min_term),
  interest_rate decimal(5,2) NOT NULL CHECK (interest_rate >= 0),
  created_by int,
  created_at timestamp,
  updated_at timestamp,
  FOREIGN KEY (created_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE LoanApplication (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  borrower_id INTEGER NOT NULL,
  loan_id int,
  loan_officer_id int,
  loan_amount decimal(15,2) CHECK (loan_amount > 0),
  application_date date,
  reference varchar(500) UNIQUE NOT NULL,
  term text NOT NULL,
  purpose text NOT NULL,
  rejection_reason text,
  submitted_at timestamp DEFAULT (CURRENT_TIMESTAMP),
  decided_at timestamp,
  reviewed_by int,
  review_date date,
  review_notes text,
  existing_loans_json text,
  disbursement_method text,
  disbursement_details text,
  declaration_language text,
  declared_at timestamp,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  deleted_by int,
  FOREIGN KEY (borrower_id) REFERENCES Borrower(id),
  FOREIGN KEY (loan_id) REFERENCES Loan(id),
  FOREIGN KEY (loan_officer_id) REFERENCES Staff(id),
  FOREIGN KEY (reviewed_by) REFERENCES Staff(id),
  FOREIGN KEY (deleted_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE LoanStatusType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status_name varchar(100) NOT NULL UNIQUE,
  status_code varchar(50) NOT NULL UNIQUE,
  status_description text
);`,

  `CREATE TABLE LoanApplicationStatus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_application_id int NOT NULL,
  loan_status_type_id int NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  FOREIGN KEY (loan_application_id) REFERENCES LoanApplication(id),
  FOREIGN KEY (loan_status_type_id) REFERENCES LoanStatusType(id),
  UNIQUE (loan_application_id, loan_status_type_id)
);`,

  `CREATE TABLE LoanApplicationApproval (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_application_id int NOT NULL,
  reviewed_by int,
  review_date date,
  review_notes text,
  is_reviewd boolean NOT NULL DEFAULT 0,
  created_at timestamp,
  updated_at timestamp,
  FOREIGN KEY (loan_application_id) REFERENCES LoanApplication(id),
  FOREIGN KEY (reviewed_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE LoanRepayment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_application_id INTEGER NOT NULL,
  due_date date NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  status varchar(50) NOT NULL DEFAULT 'pending',
  paid_at timestamp,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  deleted_by int,
  FOREIGN KEY (loan_application_id) REFERENCES LoanApplication(id),
  FOREIGN KEY (deleted_by) REFERENCES Staff(id)
);`,

  `CREATE TABLE LoanDocument (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_application_id int NOT NULL,
  document_title varchar(200) NOT NULL,
  document_file_path varchar(200) NOT NULL,
  document_description varchar(200),
  file_format varchar(10) NOT NULL,
  borrower_id int NOT NULL,
  uploaded_by int NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  deleted_by int,
  FOREIGN KEY (loan_application_id) REFERENCES LoanApplication(id),
  FOREIGN KEY (borrower_id) REFERENCES Borrower(id),
  FOREIGN KEY (uploaded_by) REFERENCES Staff(id),
  FOREIGN KEY (deleted_by) REFERENCES Staff(id)
);`
];

for (const sql of statements) {
  await client.execute(sql);
}

console.log('Migration complete');
client.close();

// const migratorConfig = {
//   allowUnorderedMigrations: true,
//   db,
//   provider: new FileMigrationProvider({
//     fs,
//     path,
//     // poINTEGER to the folder containing your migration files
//     migrationFolder: path.join(__dirname, './migrations'),
//   }),
// };

// const migrator = new Migrator(migratorConfig)

// async function runMigrations() {
//   const { error, results } = await migrator.migrateToLatest();

//   if (results) {
//     results.forEach((it) => {
//       if (it.status === 'Success') {
//         console.log(`migration "${it.migrationName}" was executed successfully`);
//       } else if (it.status === 'Error') {
//         console.error(`failed to execute migration "${it.migrationName}"`);
//       }
//     });
//   }

//   if (error) {
//     console.error('failed to migrate')
//     console.error(error)
//     process.exit(1)
//   }

//   await db.destroy();
// }

// runMigrations();
