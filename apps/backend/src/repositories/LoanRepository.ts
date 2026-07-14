import { db } from '../database/index.ts';
import type { LoanUpdate, Loan, NewLoan, NewLoanApplication } from '../database/types.ts';

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

    if (criteria.approved_date) {
        query = query.where('approved_date', '=', criteria.approved_date)
    }

    if (criteria.applied_date !== undefined) {
        query = query.where(
            'applied_date',
            criteria.applied_date === null ? 'is' : '=',
            criteria.applied_date
        )
    }

    if (criteria.disbursement_date) {
        query = query.where('disbursement_date', '=', criteria.disbursement_date)
    }

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

// const tulokset = await sql<Loan>`
//   SELECT id, nimi 
//   FROM kayttajat 
//   WHERE tila = 'aktiivinen'
// `.execute(db)

export async function cancelLoanApplication(loanApplicationId: number) {
    const cancelStatusType = await db.selectFrom('LoanStatusType')
        .where('status_name', '=', 'cancel')
        .select('id').executeTakeFirst();

    const type = db.updateTable('LoanApplication')
        .set({ 'loan_application_status_id': cancelStatusType?.id })
        .where('id', '==', loanApplicationId)
        .executeTakeFirst();

    return type;
}

export async function applyLoan(application: NewLoanApplication) {
    console.log(application)
    const loan = await db.insertInto('LoanApplication')
        .values(application)
        .returning('LoanApplication.id')
        .executeTakeFirst();

    return loan;
}

export function getLoanApplications() {
    const types = db.selectFrom('LoanApplication')
        .selectAll()
        .execute();

    return types;
}

export function getLoanApplication(applicationId: number) {
    const types = db.selectFrom('LoanApplication')
        .where('id', '=', applicationId)
        // .innerJoin('LoanApplicationStatus', 'LoanApplicationStatus.loan_application_id', 'LoanApplication.id')
        .selectAll()
        .executeTakeFirst();

    return types;
}

export function getLoanApplicationStatus(applicationId: number) {
    const status = db.selectFrom('LoanApplication')
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

export function getLoanApplicationDocs() {
    const docs = db.selectFrom('LoanDocument')
        .selectAll()
        .executeTakeFirst();

    return docs;
}