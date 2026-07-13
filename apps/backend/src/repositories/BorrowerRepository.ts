import { sql } from 'kysely';
import { db } from '../database/index.ts';
import type { BorrowerUpdate, Borrower, NewBorrower } from '../types.ts';

export async function findBorrowerById(id: number) {
    return await db.selectFrom('Borrower')
        .where('id', '=', id)
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
            .where('MainAccount.id', '=', toAccountNumber)
            .executeTakeFirstOrThrow();

        return [borrowerAccountUpdated, mainAccount]
    });

    return approveLoan;
}