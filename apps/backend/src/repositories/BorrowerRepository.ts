import { db } from '../database/index.js';

export async function findBorrowerBySevisPassId(sevispassId: string) {
    return await db.selectFrom('borrowers')
        .where('sevispass_id', '=', sevispassId)
        .selectAll()
        .executeTakeFirst();
}

export async function getBorrowerLoanApplications(borrowerId: number) {
    return await db.selectFrom('loan_applications')
        .where('borrower_id', '=', borrowerId)
        .selectAll()
        .orderBy('submitted_at', 'desc')
        .execute();
}

export async function getLoanRepayments(loanApplicationId: number) {
    return await db.selectFrom('repayments')
        .where('loan_application_id', '=', loanApplicationId)
        .selectAll()
        .orderBy('due_date', 'asc')
        .execute();
}
