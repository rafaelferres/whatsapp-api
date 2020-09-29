import { Router, NextFunction, Request, Response } from "express";
import Message from "./Message";

import Queue from "better-queue";

class Routes {
  public routes: Router;
  private queue: Queue;

  constructor(queue: Queue) {
    this.queue = queue;
    this.routes = Router();
    this.constructRoutes();
  }

  constructRoutes() {
    this.routes.get("/", (req, res) => res.send(`a`));

    this.routes.post("/api/v1/message", (req: Request, res: Response) => Message.send(req, res, this.queue));
  }
}

export default Routes;
