import { sql } from 'kysely';
import { db } from '../database/index.ts';
import type { BorrowerUpdate, Borrower, NewBorrower } from '../database/types.ts';

export async function findBorrowerById(id: number) {
    return await db.selectFrom('Borrower')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function findBorrowerBySevisPassId(sevispassId: string) {
    return await db.selectFrom('Borrower')
        .where('sevispass_id', '=', sevispassId)
        .selectAll()
        .executeTakeFirst();
}

export async function getBorrowers() {
    return await db.selectFrom('Borrower')
        .selectAll()
        .execute();
}

export async function getBorrower(id: number) {
    return await db.selectFrom('Borrower')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function updateBorrower(id: number, updateWith: BorrowerUpdate) {
    await db.updateTable('Borrower').set(updateWith).where('id', '=', id).execute()
}

export async function createBorrower(user: NewBorrower) {
    return await db.insertInto('Borrower')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow()
}

type SevisPassUser = {
    sub: string;
    name?: string;
    email?: string;
    credentials?: Array<{
        subject?: {
            firstName?: string;
            lastName?: string;
            photo?: string;
            [key: string]: unknown;
        };
    }>;
};

// The verified /api/user response only puts the claims that were actually
// disclosed inside credentials[].subject — top-level `name` is a single
// display string (often just a first name), not reliably splittable.
function extractSevisPassProfile(sevisUser: SevisPassUser) {
    const subject = sevisUser.credentials?.find((c) => c.subject)?.subject;

    const [nameFirst, ...nameRest] = (sevisUser.name ?? '').trim().split(/\s+/).filter(Boolean);

    return {
        firstName: subject?.firstName || nameFirst || 'SevisPass',
        lastName: subject?.lastName || nameRest.join(' ') || 'User',
        photo: subject?.photo ?? null,
    };
}

// Provisions a Borrower row the first time a real SevisPass identity logs in,
// and backfills name/photo on later logins once SevisPass discloses richer
// claims (e.g. after a Tier upgrade) than it did the first time around.
// Fields our schema requires but SevisPass doesn't provide (date_of_birth,
// id_number) get placeholder values.
export async function findOrCreateBySevisPass(sevisUser: SevisPassUser) {
    const { firstName, lastName, photo } = extractSevisPassProfile(sevisUser);

    const existing = await findBorrowerBySevisPassId(sevisUser.sub);
    if (existing) {
        const update: BorrowerUpdate = {};
        if (existing.first_name === 'SevisPass' && firstName !== 'SevisPass') update.first_name = firstName;
        if (existing.last_name === 'User' && lastName !== 'User') update.last_name = lastName;
        if (!existing.photo && photo) update.photo = photo;
        if (!existing.email && sevisUser.email) update.email = sevisUser.email;

        if (Object.keys(update).length > 0) {
            await updateBorrower(existing.id, update);
            return { ...existing, ...update };
        }
        return existing;
    }

    const { count } = await db
        .selectFrom('Borrower')
        .select(({ fn }) => fn.count<number>('id').as('count'))
        .executeTakeFirstOrThrow();

    const borrowerNumber = `BORROWER-${new Date().getFullYear()}-${String(Number(count) + 1).padStart(3, '0')}`;

    return await createBorrower({
        borrower_number: borrowerNumber,
        first_name: firstName,
        last_name: lastName,
        photo,
        date_of_birth: '2000-01-01',
        id_type_id: 1,
        id_number: sevisUser.sub,
        sevispass_id: sevisUser.sub,
        member_since: new Date().toISOString().slice(0, 10),
        email: sevisUser.email ?? null,
    });
}

export async function deleteBorrower(id: number) {
    return await db.deleteFrom('Borrower').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}

export async function creditAccount(fromAccountNumber: number, toAccountNumber: number, amount: number) {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const approveLoan = await db.transaction().execute(async (trx) => {
        const mainAccount = await trx.updateTable('MainAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} - ${amount}`,
            })
            .where('MainAccount.id', '=', fromAccountNumber)
            .returning('account_balance')
            .executeTakeFirstOrThrow();

        if (!mainAccount) {
            throw new Error(`MainAccount account not found`);
        }

        if (mainAccount.account_balance < amount) {
            throw new Error(`Insufficient balance. Available: ${mainAccount.account_balance}`);
        }

        const mainAccountUpdated = await trx.updateTable('MainAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} - ${amount}`,
            })
            .where('MainAccount.id', '=', fromAccountNumber)
            .returning('account_balance')
            .executeTakeFirstOrThrow();


        const borrowerAccount = await trx.updateTable('BorrowerAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} + ${amount}`,
                updated_at: new Date()
            })
            .where('BorrowerAccount.id', '=', toAccountNumber)
            .executeTakeFirstOrThrow();

        return [mainAccountUpdated, mainAccount]
    });

    return approveLoan;
}

export async function debitAccount(fromAccountNumber: number, toAccountNumber: number, amount: number) {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const approveLoan = await db.transaction().execute(async (trx) => {
        const borrowerAccount = await trx.updateTable('BorrowerAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} - ${amount}`,
            })
            .where('BorrowerAccount.id', '=', fromAccountNumber)
            .returning('account_balance')
            .executeTakeFirstOrThrow();

        if (!borrowerAccount) {
            throw new Error(`BorrowerAccount account not found`);
        }

        if (borrowerAccount.account_balance < amount) {
            throw new Error(`Insufficient balance. Available: ${borrowerAccount.account_balance}`);
        }

        const borrowerAccountUpdated = await trx.updateTable('BorrowerAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} - ${amount}`,
            })
            .where('BorrowerAccount.id', '=', fromAccountNumber)
            .returning('account_balance')
            .executeTakeFirstOrThrow();

        const mainAccount = await trx.updateTable('MainAccount')
            .set({
                account_balance: sql`${sql.raw('account_balance')} + ${amount}`,
                updated_at: new Date()
            })
            .where('id', '=', toAccountNumber)
            .executeTakeFirstOrThrow();

        return [borrowerAccountUpdated, mainAccount]
    });

    return approveLoan;
}

export async function createLoanApplication(borrowerId: number, input: {
    amount: number;
    term: string;
    purpose: string;
    existingLoans?: { lender: string; amount: number }[];
    disbursementMethod?: string;
    disbursementDetails?: string | null;
    declarationLanguage?: string;
}) {
    const { count } = await db
        .selectFrom('LoanApplication')
        .select(({ fn }) => fn.count<number>('id').as('count'))
        .executeTakeFirstOrThrow();

    const reference = `MIJ-${new Date().getFullYear()}-${String(Number(count) + 1).padStart(3, '0')}`;

    return await db.insertInto('LoanApplication')
        .values({
            reference,
            borrower_id: borrowerId,
            loan_amount: input.amount,
            term: input.term,
            purpose: input.purpose,
            // status: 'pending',
            loan_id: 1,
            loan_officer_id: 1,
            application_date: new Date(),
            existing_loans_json: input.existingLoans?.length ? JSON.stringify(input.existingLoans) : null,
            disbursement_method: input.disbursementMethod ?? null,
            disbursement_details: input.disbursementDetails ?? null,
            declaration_language: input.declarationLanguage ?? null,
            declared_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
}

export async function getBorrowerLoanApplications(borrowerId: number) {
    return await db.selectFrom('LoanApplication')
        .where('borrower_id', '=', borrowerId)
        .selectAll()
        .orderBy('submitted_at', 'desc')
        .execute();
}

export async function getLoanRepayments(loanApplicationId: number) {
    return await db.selectFrom('LoanRepayment')
        .where('loan_application_id', '=', loanApplicationId)
        .selectAll()
        .orderBy('due_date', 'asc')
        .execute();
}
