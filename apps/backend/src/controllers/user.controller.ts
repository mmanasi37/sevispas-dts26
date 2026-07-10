import type { Request, Response } from "express";
import { db } from "../database/index.js";
import Controller from "./base.controller.js";

export async function findPeople(req: Request, res: Response) {
    const users = await db
        .selectFrom('User')
        .select('id')
        .where('first_name', '=', 'Arnold')
        .execute();

    res.json(users);
}