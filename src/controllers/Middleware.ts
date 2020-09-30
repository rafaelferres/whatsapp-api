import { NextFunction, Request, Response } from "express";
import { IConfig } from "../interfaces";
import { getConfig } from "../config";

import messageDTO from "./../dto/Mensage";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

class Middleware {
  public async verifyBearerToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    var bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(401);
      res.json({
        mensagem: "Não autorizado",
      });
    }
  }

  public async validateCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    var config: IConfig = getConfig();
    if (req.token == config.token) {
      next();
    } else {
      res.status(403);
      res.json({
        mensagem: "Sessão inválida",
      });
    }
  }

  public async checkMessageData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      var data: any = await messageDTO.validate(req.body);
      req.body = data;
      next();
    } catch (err) {
      res.status(400);
      res.send({ mensagem: err.message });
    }
  }
}

export default new Middleware();
