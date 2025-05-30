import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`-- METHOD : ${req.method} \n -- PATH : ${req.url} \n -- BODY : ${JSON.stringify(req.body)}`)
    next()
}