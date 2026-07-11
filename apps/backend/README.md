# Backend

# Entities
Staff
Borrower
Loan
LoanApplication
LoanStatus: pending, under review, approved, or rejected — with a reason if rejected
LoanDocument



# Loan Process
## Use Case - Borrower Apply for loan (Has SevisPass ID)
Borrower opens SevisWallet
Borrower initiate the loan application
System requests for borrower's credentials; UID, first_name, last_name, date_of_birth, gender, email, phone_number, physical_address, etc...
Borrower accepts request
System requests specific data which are not capture by SevisPass; monthly_income, employment_status, employer, etc...
Borrower accepts request
System requests for borrowers face, and fingerprint for eKYC.
Borrower accepts request and scan face and fingerprint
Borrower submits



## Use Case - Borrower Apply for loan (Does not have SevisPass ID)
Borrower creates SevisPass account
Borrower Apply for loan