import { NextFunction, Request, Response } from "express";
import Queue from "better-queue";

class Message {

    public send(req: Request, res: Response, queue: Queue){
        queue.push(req.body);

        res.sendStatus(200);
    }
}

export default new Message();