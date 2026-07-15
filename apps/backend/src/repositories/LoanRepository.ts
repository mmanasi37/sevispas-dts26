import { db } from '../database/index.ts';
import type { LoanUpdate, Loan, NewLoan, NewLoanApplication, LoanApplicationStatus, Borrower, Staff } from '../database/types.ts';
import { borrower, loanApplicationStatus, loanApplicationStatuses, loanDocuments, loanOfficer, loanRepayments, loanType, reviewer } from '../database/helpers.ts';

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
    // const loanApplications = await db.selectFrom('LoanApplication')
    //     .innerJoin('LoanApplicationStatus', 'LoanApplication.id', 'LoanApplicationStatus.loan_application_id')
    //     .innerJoin('Loan', 'Loan.id', 'LoanApplication.loan_id')
    //     .innerJoin('Borrower', 'Borrower.id', 'LoanApplication.borrower_id')
    //     .innerJoin('LoanDocument', 'LoanApplication.id', 'LoanDocument.loan_application_id')
    //     .innerJoin('LoanRepayment', 'LoanApplication.id', 'LoanRepayment.loan_application_id')
    //     .innerJoin('Staff', 'Staff.id', 'LoanApplication.loan_officer_id')
    //     .selectAll()
    //     .execute();

    const results = await db
        .selectFrom('LoanApplication')
        .selectAll('LoanApplication')
        // .innerJoin('LoanApplicationStatus as status', 'status.id', 'status.loan_application_id')
        // .innerJoin('LoanStatusType as status_type', 'status_type.id', 'status.loan_status_type_id')
        .select((eb) => [
            borrower(eb.ref('LoanApplication.borrower_id')),
            loanType(eb.ref('LoanApplication.loan_id')),
            loanApplicationStatus(eb.ref('LoanApplication.id')),
            loanApplicationStatuses(eb.ref('LoanApplication.id')),
            loanDocuments(eb.ref('LoanApplication.id')),
            loanRepayments(eb.ref('LoanApplication.id')),
            loanOfficer(eb.ref('LoanApplication.loan_officer_id')),
            // reviewer(eb.ref('LoanApplication.reviewed_by'))
        ])
        .execute();

    const parsedResult = results.map((row) => {

        return {
            ...row,
            borrower: JSON.parse(row.borrower as unknown as string),
            loan: JSON.parse(row.loan as unknown as string),
            status_history: JSON.parse(row.status_history as unknown as string),
            documents: JSON.parse(row.documents as unknown as string),
            repayments: JSON.parse(row.repayments as unknown as string),
            loan_officer: JSON.parse(row.loan_officer as unknown as string),
            // reviewed_by: JSON.parse(row.reviewed_by as unknown as string),
        }
    })

    return parsedResult;
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