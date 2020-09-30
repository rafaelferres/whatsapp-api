import { Router, NextFunction, Request, Response } from "express";
import Message from "./Message";
import Middleware from "./Middleware";

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
    this.routes.post("/api/v1/message", Middleware.verifyBearerToken, Middleware.validateCredentials, Middleware.checkMessageData, (req: Request, res: Response) => Message.send(req, res, this.queue));
  }
}

export default Routes;
