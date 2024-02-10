import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ErrorsService } from "src/errors/errors.service";

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
   constructor(private pError: ErrorsService) {}
   async use(req: Request, res: Response, next: NextFunction) {
      // await this.srvGlobal.registarIndividualRequest(code_send, req);
      next();
   }
}
