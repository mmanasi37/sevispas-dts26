import { db } from '../database/index.ts';
import type { LoanUpdate, Loan, NewLoan, NewLoanApplication, LoanApplicationStatus, Borrower, Staff } from '../database/types.ts';

export function getLoanTypes() {
    const types = db.selectFrom('Loan').selectAll().execute();

    return types;
}

export function getLoanType(loanTypeId: number) {
    const type = db.selectFrom('Loan')
        .where('id', '=', loanTypeId)
        .selectAll()
        .executeTakeFirst();

    return type;
}

export async function findLoanTypeById(id: number) {
    return await db.selectFrom('Loan')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function findLoanType(criteria: Partial<Loan>) {
    let query = db.selectFrom('Loan')

    if (criteria.id) {
        query = query.where('id', '=', criteria.id)
    }

    // if (criteria.approved_date) {
    //     query = query.where('approved_date', '=', criteria.approved_date)
    // }

    // if (criteria.applied_date !== undefined) {
    //     query = query.where(
    //         'applied_date',
    //         criteria.applied_date === null ? 'is' : '=',
    //         criteria.applied_date
    //     )
    // }

    // if (criteria.disbursement_date) {
    //     query = query.where('disbursement_date', '=', criteria.disbursement_date)
    // }

    if (criteria.created_at) {
        query = query.where('created_at', '=', criteria.created_at)
    }

    return await query.selectAll().execute()
}

export async function updateLoanType(id: number, updateWith: LoanUpdate) {
    await db.updateTable('Loan').set(updateWith).where('id', '=', id).execute()
}

export async function createLoanType(loan: NewLoan) {
    return await db.insertInto('Loan')
        .values(loan)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function deleteLoanType(id: number) {
    return await db.deleteFrom('Loan').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}

export async function cancelLoanApplication(loanApplicationId: number) {
    const cancelStatusType = await db.selectFrom('LoanStatusType')
        .where('status_name', '=', 'cancel')
        .select('id').executeTakeFirst();

    // const type = db.updateTable('LoanApplication')
    //     .set({ 'loan_application_status_id': cancelStatusType?.id })
    //     .where('id', '==', loanApplicationId)
    //     .executeTakeFirst();

    return cancelStatusType;
}

export async function applyLoan(application: NewLoanApplication) {
    try {
        const loan = await db.insertInto('LoanApplication')
            .values(application)
            .returning('LoanApplication.id')
            .executeTakeFirstOrThrow();

        return loan;
    } catch (error) {
        throw error;
    }
}

export async function getLoanApplications() {
    // Get all loan applications
    const loanApplications = await db.selectFrom('LoanApplication')
        .selectAll()
        .execute();

    if (loanApplications.length === 0) {
        return [];
    }

    const loanIds = loanApplications.map(app => app.id).filter(Boolean);
    const borrowerIds = loanApplications.map(app => app.borrower_id).filter(Boolean);
    const loanIdsForLoans = loanApplications.map(app => app.loan_id).filter(Boolean);
    const staffIds = loanApplications.map(app => app.loan_officer_id).filter(Boolean);

    console.log("loanIds", loanIds);
    console.log("borrowerIds", borrowerIds);
    console.log("loanIdsForLoans", loanIdsForLoans);
    console.log("staffIds", staffIds);

    // Fetch all related data in parallel
    const [statuses, loans, borrowers, staff] = await Promise.all([
        db.selectFrom('LoanApplicationStatus')
            .where('loan_application_id', 'in', loanIds)
            .orderBy('created_at', 'desc')
            .execute() as Promise<LoanApplicationStatus[]>,

        db.selectFrom('Loan')
            .where('id', 'in', loanIdsForLoans)
            .execute() as Promise<Loan[]>,

        db.selectFrom('Borrower')
            .where('id', 'in', borrowerIds)
            .execute() as Promise<Borrower[]>,

        db.selectFrom('Staff')
            .where('id', 'in', staffIds)
            .execute() as Promise<Staff[]>
    ]);

    // Create maps for quick lookups
    const statusMap = new Map<number, LoanApplicationStatus>();
    statuses.forEach(status => {
        if (!statusMap.has(status.loan_application_id)) {
            statusMap.set(status.loan_application_id, status);
        }
    });

    const loanMap = new Map(loans.map(loan => [loan.id, loan]));
    const borrowerMap = new Map(borrowers.map(borrower => [borrower.id, borrower]));
    const staffMap = new Map(staff.map(member => [member.id, member]));

    // Combine all data
    const result = loanApplications.map(app => ({
        ...app,
        status: statusMap.get(app.id) || null,
        loan: loanMap.get(app.loan_id) || null,
        borrower: borrowerMap.get(app.borrower_id) || null,
        staff: staffMap.get(app.loan_officer_id) || null
    }));

    return result;
}

export async function getLoanApplication(applicationId: number) {
    const types = await db.selectFrom('LoanApplication')
        .where('id', '=', applicationId)
        // .innerJoin('LoanApplicationStatus', 'LoanApplicationStatus.loan_application_id', 'LoanApplication.id')
        .selectAll()
        .executeTakeFirst();

    return types;
}

export async function getLoanApplicationStatus(applicationId: number) {
    const status = await db.selectFrom('LoanApplication')
        .where('LoanApplication.id', '=', applicationId)
        .leftJoin('LoanApplicationStatus', 'LoanApplication.id', 'LoanApplicationStatus.loan_application_id')
        .selectAll()
        .executeTakeFirst();
    // const status = db.selectFrom('LoanApplicationStatus')
    //     .where('loan_application_id', '=', applicationId)
    //     .innerJoin('LoanApplication', 'LoanApplication.loan_application_status_id', 'LoanApplicationStatus.id')
    //     .selectAll()
    //     .executeTakeFirst();

    return status;
}

export async function getLoanApplicationDocs() {
    const docs = await db.selectFrom('LoanDocument')
        .selectAll()
        .executeTakeFirst();

    return docs;
}

export async function getLoanApplicationRepayments(loanApplicationId: number) {
    const repayments = await db.selectFrom('LoanRepayment')
        .where('loan_application_id', '=', loanApplicationId)
        .innerJoin('LoanApplication', 'LoanApplication.id', 'LoanRepayment.loan_application_id')
        .innerJoin('Borrower', 'Borrower.id', 'LoanApplication.borrower_id')
        .selectAll()
        .execute();

    return repayments;
}