import {
   HttpException,
   HttpStatus,
   Injectable,
   NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { UniqueIdentifier } from "mssql";
import { ValidGlobalResDto } from "./dto/responses/valid-global-res.dto";

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
   constructor(private srvMSSQL: MSSQLService) {}
   async use(req: Request, res: Response, next: NextFunction) {
      const autorizacion = req.headers.authorization;
      if (autorizacion?.split(" ")[0] !== "Bearer") {
         throw new HttpException(
            "[VAL]Ingrese Bearer Authentication",
            HttpStatus.UNAUTHORIZED,
         );
      }
      const bearer = autorizacion.split(" ")[1];
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piAuthorizationsId",
            typeVariable: UniqueIdentifier,
            value: bearer,
         },
      ];

      const result = await this.srvMSSQL.executeProcedure(
         "spGetAuthorizations",
         parameters,
      );

      const resultMapper: ValidGlobalResDto = {
         Message: result.Message ?? "",
         IsActive: result.IsActive ?? false,
      };

      if (!resultMapper.IsActive) {
         throw new HttpException(
            `[VAL]${resultMapper.Message}`,
            HttpStatus.UNAUTHORIZED,
         );
      }

      next();
   }
}
