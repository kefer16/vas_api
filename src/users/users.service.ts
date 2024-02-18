import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";
import { DateTime, VarChar } from "mssql";
import { encrypt } from "src/utils/bcrypt.util";
import { GetPasswordUserDto } from "./dto/requests/get-password-user.dto";
import { LoginAccountResDto } from "src/accounts/dto/responses/login-account-res.dto";
@Injectable()
export class UsersService {
   constructor(private srvMSSQL: MSSQLService) {}

   async countUserNameRepeat(pUserName: string): Promise<number> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piUserName",
            typeVariable: VarChar(45),
            value: pUserName,
         },
      ];

      return await this.srvMSSQL.executeProcedureCount(
         "spFindRepeatUserName",
         parameters,
      );
   }
   async countEmailRepeat(pEmail: string): Promise<number> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piEmail",
            typeVariable: VarChar(45),
            value: pEmail,
         },
      ];

      return await this.srvMSSQL.executeProcedureCount(
         "spFindRepeatEmail",
         parameters,
      );
   }

   async createUser(
      pUserName: string,
      pPassword: string,
      pEmail: string,
      pCreationDate: Date,
   ): Promise<boolean> {
      pPassword = await encrypt(pPassword);

      const parameters: ProcedureParameter[] = [
         {
            variableName: "peUserName",
            typeVariable: VarChar(45),
            value: pUserName,
         },
         {
            variableName: "pePassword",
            typeVariable: VarChar(150),
            value: pPassword,
         },
         {
            variableName: "peEmail",
            typeVariable: VarChar(150),
            value: pEmail,
         },
         {
            variableName: "peCreationDate",
            typeVariable: DateTime,
            value: pCreationDate,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spCreateUser",
         parameters,
      );
   }

   async getPassword(pUserName: string): Promise<GetPasswordUserDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piUserName",
            typeVariable: VarChar(45),
            value: pUserName,
         },
      ];

      const result = await this.srvMSSQL.executeProcedureJSON(
         "spGetPasswordUser",
         parameters,
      );
      const resultMapper: GetPasswordUserDto = JSON.parse(result);
      return resultMapper;
   }

   async getUser(pUserName: string): Promise<LoginAccountResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piUserName",
            typeVariable: VarChar(45),
            value: pUserName,
         },
      ];

      const result = await this.srvMSSQL.executeProcedureJSON(
         "spGetUser",
         parameters,
      );
      const resultMapper: LoginAccountResDto = JSON.parse(result);
      return resultMapper;
   }
}
