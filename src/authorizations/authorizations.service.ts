import { Injectable } from "@nestjs/common";
import { DateTime, VarChar } from "mssql";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";

@Injectable()
export class AuthorizationsService {
   constructor(private srvMSSQL: MSSQLService) {}
   async countAuthorization(pEmail: string, pCode: string): Promise<number> {
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

   async countActiveAuthorization(pUserName: string): Promise<number> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piUsername",
            typeVariable: VarChar(45),
            value: pUserName,
         },
      ];

      return await this.srvMSSQL.executeProcedureCount(
         "spCountActiveAuthorization",
         parameters,
      );
   }

   async createAthorization(
      pEmail: string,
      pToken: string,
      pCreationDate: Date,
      pIsTransacction?: boolean,
   ): Promise<boolean> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piEmail",
            typeVariable: VarChar(45),
            value: pEmail,
         },
         {
            variableName: "piCode",
            typeVariable: VarChar(6),
            value: pToken,
         },
         {
            variableName: "piCreationDate",
            typeVariable: DateTime,
            value: pCreationDate,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spCreateAuthorization",
         parameters,
         pIsTransacction,
      );
   }

   async updateAuthorization(pEmail: string, pCode: string): Promise<boolean> {
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

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spUpdateAuthorization",
         parameters,
      );
   }
}
