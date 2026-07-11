import type { Request, Response } from "express";
import * as borrowerRepo from '../repositories/BorrowerRepository.ts'

export async function getBorrowers(req: Request, res: Response) {
    const borrowers = await borrowerRepo.getBorrowers();

    res.json(borrowers);
}

export async function getBorrower(req: Request, res: Response) {
    const borrowerId = parseInt(String(req.params.borrowerId));
    const borrower = await borrowerRepo.getBorrower(borrowerId);

    res.json(borrower);
}