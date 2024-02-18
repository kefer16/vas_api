import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DateTime, VarChar } from "mssql";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";
import { generateNumberRandom } from "src/utils/util.utils";
import { CreateAuthorizacionUserReqDto } from "./dto/requests/create-authorizacion-user-req.dto";
import { SendEmailConfirm } from "src/utils/resend.util";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthorizationsUsersService {
   constructor(
      private srvMSSQL: MSSQLService,
      private srvUser: UsersService,
   ) {}

   async createAuthorizationUser(
      pBody: CreateAuthorizacionUserReqDto,
   ): Promise<boolean> {
      const countRepeatUserName = await this.srvUser.countUserNameRepeat(
         pBody.UserName,
      );

      if (countRepeatUserName > 0) {
         throw new HttpException(
            "[VAL]El nombre de usuario ya existe",
            HttpStatus.BAD_REQUEST,
         );
      }

      const countRepeatEmail = await this.srvUser.countEmailRepeat(pBody.Email);

      if (countRepeatEmail > 0) {
         throw new HttpException(
            "[VAL]Usted ya tiene una cuenta",
            HttpStatus.BAD_REQUEST,
         );
      }

      const TOKEN = String(generateNumberRandom());

      SendEmailConfirm(TOKEN);

      const parameters: ProcedureParameter[] = [
         {
            variableName: "piEmail",
            typeVariable: VarChar(45),
            value: pBody.Email,
         },
         {
            variableName: "piCode",
            typeVariable: VarChar(6),
            value: TOKEN,
         },
         {
            variableName: "piCreationDate",
            typeVariable: DateTime,
            value: pBody.CreationDate,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spCreateAuthorization",
         parameters,
      );
   }
}
