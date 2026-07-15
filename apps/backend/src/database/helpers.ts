import { sql, type Expression } from "kysely"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite"
import { db } from "./index.ts";

export function reviewer(reviewerId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('Staff as reviewer')
            .select(['reviewer.id', 'reviewer.first_name', 'reviewer.last_name'])
            .where('reviewer.id', '=', reviewerId)
    ).as('reviewed_by')
}

export function loanApplication(loanApplicationId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('LoanApplication as loan_application')
            .selectAll()
            .where('loan_application.id', '=', loanApplicationId)
    ).as('loan_application')
}

export function loanType(loanTypeId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('Loan as loan')
            .select([
                'loan.id',
                'loan.loan_name',
                'loan.loan_description',
                'loan.interest_rate',
                'loan.min_amount',
                'loan.max_amount',
                'loan.min_term',
                'loan.max_term',
                'loan.created_at',
                'loan.updated_at'
            ])
            .where('loan.id', '=', loanTypeId)

    ).as('loan')
}

export function borrower(borrowerId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('Borrower as borrower')
            .select(['borrower.id', 'borrower.first_name', 'borrower.last_name', 'borrower.email'])
            .where('borrower.id', '=', borrowerId)
    ).as('borrower')
}

export function loanApplicationStatus(loanApplicationId: Expression<number>) {
    // return jsonObjectFrom(
    //     db.selectFrom('LoanApplicationStatus as status')
    //         .innerJoin('LoanStatusType as status_type', 'status_type.id', 'status.loan_status_type_id')
    //         // .select(['status.id', 'status.created_at', 'status.updated_at'])
    //         // .select((eb) => [
    //         //     loanStatusType(eb.ref('status.loan_status_type_id'))
    //         // ])
    //         .select([
    //             'status.id',
    //             'status.created_at',
    //             'status.updated_at',
    //             'status_type.status_name as status'
    //         ])
    //         .whereRef('status.loan_application_id', '=', loanApplicationId)
    //         .orderBy('status.created_at', 'desc')
    //         .limit(1)
    // ).as('status');

    return sql<string>`(
        SELECT status_type.status_name
        FROM "LoanApplicationStatus" as status
        JOIN "LoanStatusType" as status_type ON status_type.id = status.loan_status_type_id
        WHERE status.loan_application_id = ${loanApplicationId}
        ORDER BY status.created_at DESC
        LIMIT 1
    )`.as('status');
}

export function loanStatusType(loanStatusTypeId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('LoanStatusType as status_type')
            .select(['status_type.id', 'status_type.status_name'])
            .where('status_type.id', '=', loanStatusTypeId)
    ).as('status_type')
}

export function loanApplicationStatuses(loanApplicationId: Expression<number>) {
    return jsonArrayFrom(
        db.selectFrom('LoanApplicationStatus as status')
            .innerJoin('LoanStatusType as status_type', 'status_type.id', 'status.loan_status_type_id')
            .select([
                'status.id',
                'status.created_at',
                'status.updated_at',
                'status_type.status_name as status_type'
            ])
            // .select((eb) => [
            //     loanStatusType(eb.ref('status.loan_status_type_id'))
            // ])
            .whereRef('status.loan_application_id', '=', loanApplicationId)
            .orderBy('status.created_at', 'desc')
    ).as('status_history')
}

export function loanDocuments(loanApplicationId: Expression<number>) {
    return jsonArrayFrom(
        db.selectFrom('LoanDocument as documents')
            .select(['documents.id', 'documents.document_title', 'documents.document_file_path'])
            .whereRef('documents.loan_application_id', '=', loanApplicationId)
    ).as('documents')
}

export function loanRepayments(loanApplicationId: Expression<number>) {
    return jsonArrayFrom(
        db.selectFrom('LoanRepayment as repayments')
            .select(['repayments.id', 'amount', 'due_date', 'status', 'paid_at'])
            .where('repayments.loan_application_id', '=', loanApplicationId)
            .orderBy('repayments.due_date')
    ).as('repayments')
}

export function loanOfficer(loanOfficerId: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('Staff as loan_officer')
            .select(['loan_officer.id', 'loan_officer.first_name', 'loan_officer.last_name'])
            .whereRef('loan_officer.id', '=', loanOfficerId)
    ).as('loan_officer')
}