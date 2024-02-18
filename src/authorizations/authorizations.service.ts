import { Injectable } from "@nestjs/common";
import { VarChar } from "mssql";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";

@Injectable()
export class AuthorizationsService {
   constructor(private srvMSSQL: MSSQLService) {}
   async countAuthorizationUser(
      pEmail: string,
      pCode: string,
   ): Promise<number> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piEmail",
            typeVariable: VarChar(45),
            value: pEmail,
         },
         {
            variableName: "piCode",
            typeVariable: VarChar(6),
            value: pCode,
         },
      ];

      return await this.srvMSSQL.executeProcedureCount(
         "spCountAuthorization",
         parameters,
      );
   }
}
