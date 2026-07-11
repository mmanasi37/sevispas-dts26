import type { Request, Response } from "express";
import * as staffRepo from '../repositories/StaffRepository.ts'

export async function getStaffs(req: Request, res: Response) {
    const staffs = await staffRepo.getStaffs();

    res.json(staffs);
}

export async function getStaff(req: Request, res: Response) {
    const staffId = parseInt(String(req.params.staffId));
    const staff = await staffRepo.getStaff(staffId);

    res.json(staff);
}