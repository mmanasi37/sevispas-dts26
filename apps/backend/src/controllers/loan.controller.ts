import type { Request, Response } from "express";
import * as loanRepo from '../repositories/LoanRepository.ts';
import * as borrowerRepo from '../repositories/BorrowerRepository.ts';
import * as staffRepo from '../repositories/StaffRepository.ts';

export async function getLoanTypes(req: Request, res: Response) {
    const loans = await loanRepo.getLoanTypes();

    res.json(loans);
}

export async function getLoanType(req: Request, res: Response) {
    const loanTypeId = parseInt(String(req.params.loanTypeId));

    const loan = await loanRepo.getLoanType(loanTypeId);

    res.json(loan);
}

export async function updateLoanType(req: Request, res: Response) {
    const loanTypeId = parseInt(String(req.params.loanTypeId));
    const payload = req.body;

    const loan = await loanRepo.updateLoanType(loanTypeId, payload);

    res.json(loan);
}

export async function cancelLoan(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));

    const loan = await loanRepo.cancelLoanApplication(loanId);

    res.json(loan);
}

export async function applyLoan(req: Request, res: Response) {
    const borrowerInfo = req.body;

    const {
        loan_id,
        loan_amount
    } = borrowerInfo;

    const borrower_id = 1;
    const loan_officer_id = 1; // will be determined when the application falls into the queue and an officer accepts the application for processing
    const loan_application_status_id = 1;
    const application_date = new Date();

    const loan = await loanRepo.applyLoan({
        loan_id,
        loan_officer_id,
        borrower_id,
        loan_amount,
        loan_application_status_id,
        application_date
    });

    res.json(loan);
}

export async function getLoanApplications(req: Request, res: Response) {
    const types = await loanRepo.getLoanApplications();

    res.json(types);
}

export async function getLoanApplication(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));
    const types = await loanRepo.getLoanApplication(loanId);

    res.json(types);
}

export async function getLoanApplicationStatus(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));

    const application = await loanRepo.getLoanApplication(loanId);
    const status = await loanRepo.getLoanApplicationStatus(loanId);
    const reviewedBy = application?.reviewed_by && await staffRepo.getStaff(application?.reviewed_by);
    const borrower = application?.borrower_id && await borrowerRepo.getBorrower(application?.borrower_id);
    const loanOfficer = application?.loan_officer_id && await borrowerRepo.getBorrower(application?.loan_officer_id);

    res.json({
        ...application,
        statuses: [status],
        borrower,
        loan: application,
        reviewed_by: reviewedBy,
        loan_officer: loanOfficer
    });
}

export async function updateLoanApplication(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));
    const types = await loanRepo.getLoanApplication(loanId);

    res.json(types);
}

export async function submitLoanApplication(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));
    const types = await loanRepo.getLoanApplication(loanId);

    res.json(types);
}

export async function cancelLoanApplication(req: Request, res: Response) {
    const loanId = parseInt(String(req.params.loanId));
    const types = await loanRepo.getLoanApplication(loanId);

    res.json(types);
}
