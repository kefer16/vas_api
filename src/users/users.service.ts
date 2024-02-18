import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";
import { UserResDto } from "./dto/responses/user-res.dto";
import { DateTime, UniqueIdentifier, VarChar } from "mssql";
import { CreateUserReqDto } from "./dto/requests/create-user-req.dto";
import { UpdateUserReqDto } from "./dto/requests/update-user-req.dto";
import { encrypt } from "src/utils/bcrypt.util";
import { AuthorizationsService } from "src/authorizations/authorizations.service";
@Injectable()
export class UsersService {
   constructor(
      private srvMSSQL: MSSQLService,
      private srvAutho: AuthorizationsService,
   ) {}

   async getModules(): Promise<UserResDto[]> {
      const result = await this.srvMSSQL.executeProcedure("spGetModules");

      const resultMapper: UserResDto[] = JSON.parse(result.JSON);

      return resultMapper;
   }

   async getModule(pId: string): Promise<UserResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];
      const result = await this.srvMSSQL.executeProcedure(
         "spGetModule",
         parameters,
      );

      const resultMapper: UserResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
   }

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

   async createUser(pBody: CreateUserReqDto): Promise<boolean> {
      const countUserNameRepeat = await this.countUserNameRepeat(
         pBody.UserName,
      );

      if (countUserNameRepeat > 0) {
         throw new HttpException(
            "El nombre de usuario ya existe",
            HttpStatus.BAD_REQUEST,
         );
      }
      const countEmailRepeat = await this.countEmailRepeat(pBody.Email);
      if (countEmailRepeat > 0) {
         throw new HttpException(
            "Usted ya tiene una cuenta",
            HttpStatus.BAD_REQUEST,
         );
      }

      const countAuthorizationUser = await this.srvAutho.countAuthorizationUser(
         pBody.Email,
         pBody.CodeConfirmation,
      );

      if (countAuthorizationUser <= 0) {
         throw new HttpException(
            "No existe niguna confirmación pendiente para este correo",
            HttpStatus.BAD_REQUEST,
         );
      }

      pBody.Password = await encrypt(pBody.Password);

      const parameters: ProcedureParameter[] = [
         {
            variableName: "peUserName",
            typeVariable: VarChar(45),
            value: pBody.UserName,
         },
         {
            variableName: "pePassword",
            typeVariable: VarChar(150),
            value: pBody.Password,
         },
         {
            variableName: "peEmail",
            typeVariable: VarChar(150),
            value: pBody.Email,
         },
         {
            variableName: "peCreationDate",
            typeVariable: DateTime,
            value: pBody.CreationDate,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spCreateUser",
         parameters,
      );
   }

   async updateModule(
      pId: string,
      pBody: UpdateUserReqDto,
   ): Promise<UserResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
         {
            variableName: "piName",
            typeVariable: VarChar(100),
            value: pBody.UserId,
         },
      ];

      const result = await this.srvMSSQL.executeProcedure(
         "spUpdateModule",
         parameters,
      );

      const resultMapper: UserResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
   }

   async deleteModule(pId: string): Promise<boolean> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spDeleteModule",
         parameters,
      );
   }
}
