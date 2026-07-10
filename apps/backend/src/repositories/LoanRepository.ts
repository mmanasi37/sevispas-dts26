import { db } from '../database/index.js';
import { LoanUpdate, Loan, NewLoan } from '../types.js';

export async function findLoanById(id: number) {
    return await db.selectFrom('Loan')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function findLoan(criteria: Partial<Loan>) {
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

export async function updateLoan(id: number, updateWith: LoanUpdate) {
    await db.updateTable('Loan').set(updateWith).where('id', '=', id).execute()
}

export async function createLoan(loan: NewLoan) {
    return await db.insertInto('Loan')
        .values(loan)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function deleteLoan(id: number) {
    return await db.deleteFrom('Loan').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}