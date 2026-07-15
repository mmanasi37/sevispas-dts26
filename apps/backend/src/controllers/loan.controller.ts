import type { NextFunction, Request, Response } from "express";
import * as loanRepo from '../repositories/LoanRepository.ts';
import * as borrowerRepo from '../repositories/BorrowerRepository.ts';
import * as staffRepo from '../repositories/StaffRepository.ts';
import { handleDatabaseError } from "../libs/utils.ts";

export async function getLoanTypes(req: Request, res: Response, next: NextFunction) {
    try {
        const loans = await loanRepo.getLoanTypes();

        res.json(loans);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function getLoanType(req: Request, res: Response, next: NextFunction) {
    const loanTypeId = parseInt(String(req.params.loanTypeId));

    try {
        const loan = await loanRepo.getLoanType(loanTypeId);

        res.json(loan);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function updateLoanType(req: Request, res: Response, next: NextFunction) {
    const loanTypeId = parseInt(String(req.params.loanTypeId));
    const payload = req.body;

    try {
        const loan = await loanRepo.updateLoanType(loanTypeId, payload);

        res.json(loan);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function cancelLoan(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));

    try {
        const loan = await loanRepo.cancelLoanApplication(loanId);

        res.json(loan);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function applyLoan(req: Request, res: Response, next: NextFunction) {
    const borrowerInfo = req.body;

    const {
        loan_id,
        loan_amount,
        purpose
    } = borrowerInfo;

    const borrower_id = 1;
    const count = 2;
    const loan_officer_id = 1; // will be determined when the application falls into the queue and an officer accepts the application for processing
    const application_date = new Date();
    const reference = `MIJ-${new Date().getFullYear()}-${String(Number(count) + 1).padStart(3, '0')}`;

    const term = "4years";

    try {
        const loan = await loanRepo.applyLoan({
            loan_id,
            loan_officer_id,
            borrower_id,
            loan_amount,
            application_date,
            purpose,
            reference,
            term
        });

        res.json(loan);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);
        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function getLoanApplications(req: Request, res: Response, next: NextFunction) {
    try {
        const types = await loanRepo.getLoanApplications();

        res.json(types);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function getLoanApplication(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));
    try {
        const types = await loanRepo.getLoanApplication(loanId);

        res.json(types);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function getLoanApplicationStatus(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));

    try {
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
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function updateLoanApplication(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));
    try {
        const types = await loanRepo.getLoanApplication(loanId);

        res.json(types);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function getLoanApplicationRepayments(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));
    try {
        const repayments = await loanRepo.getLoanApplicationRepayments(loanId);

        res.json(repayments);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function submitLoanApplication(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));
    try {
        const types = await loanRepo.getLoanApplication(loanId);

        res.json(types);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}

export async function cancelLoanApplication(req: Request, res: Response, next: NextFunction) {
    const loanId = parseInt(String(req.params.loanId));
    try {
        const types = await loanRepo.getLoanApplication(loanId);

        res.json(types);
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        if (dbError) {
            res.status(dbError.status).json({
                error: dbError.error
            });
        }

        next(error);
    }
}
