import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthorizationsService } from "src/authorizations/authorizations.service";
import { UsersService } from "src/users/users.service";
import { generateNumberRandom } from "src/utils/util.utils";
import { ActiveAccountReqDto } from "./dto/requests/active-account-req.dto";
import { CreateAccountReqDto } from "./dto/requests/create-account-req.dto";
import { EmailsService } from "src/emails/emails.service";
import { LoginAccountReqDto } from "./dto/requests/login-account-req.dto";
import { comparePassword } from "src/utils/bcrypt.util";
import { LoginAccountResDto } from "./dto/responses/login-account-res.dto";
import { MSSQLService } from "src/mssql/mssql.service";

@Injectable()
export class AccountsService {
   constructor(
      private srvMSSQL: MSSQLService,
      private srvAuth: AuthorizationsService,
      private srvUser: UsersService,
      private srvEmail: EmailsService,
   ) {}

   async createAccount(pBody: CreateAccountReqDto): Promise<boolean> {
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
            "[VAL]Usted ya tiene una con el mismo correo",
            HttpStatus.BAD_REQUEST,
         );
      }
      const TOKEN = String(generateNumberRandom());

      return this.srvMSSQL.executeTransacctionIsSuccess(
         "[VAL]Hubo un error al crear la cuenta",
         async () => {
            await this.srvUser.createUser(
               pBody.UserName,
               pBody.Password,
               pBody.Email,
               pBody.CreationDate,
               true,
            );

            await this.srvAuth.createAthorization(
               pBody.Email,
               TOKEN,
               pBody.CreationDate,
               true,
            );
            return true;
         },
      );
   }

   async activateAccount(pBody: ActiveAccountReqDto): Promise<boolean> {
      const countAuthorizationUser = await this.srvAuth.countAuthorization(
         pBody.Email,
         pBody.CodeConfirmation,
      );

      if (countAuthorizationUser <= 0) {
         throw new HttpException(
            "[VAL]No existe niguna confirmación pendiente para este correo",
            HttpStatus.BAD_REQUEST,
         );
      }
      const isSuccessUpdateAuthorization =
         await this.srvAuth.updateAuthorization(
            pBody.Email,
            pBody.CodeConfirmation,
         );
      if (!isSuccessUpdateAuthorization) {
         throw new HttpException(
            "[VAL]Hubo un error al activar la cuenta",
            HttpStatus.BAD_REQUEST,
         );
      }

      return true;
   }

   async loginAccount(pBody: LoginAccountReqDto): Promise<LoginAccountResDto> {
      const getPassword = await this.srvUser.getPassword(pBody.UserName);
      if (!getPassword.Password) {
         throw new HttpException(
            "[VAL]Usuario o contraseña incorrecta",
            HttpStatus.BAD_REQUEST,
         );
      }
      const countActiveAuthorization =
         await this.srvAuth.countActiveAuthorization(pBody.UserName);

      if (countActiveAuthorization <= 0) {
         throw new HttpException(
            "[VAL]Por favor, activa tu cuenta",
            HttpStatus.BAD_REQUEST,
         );
      }

      if (countActiveAuthorization > 1) {
         throw new HttpException(
            "[VAL]Ocurrió un error al Iniciar Sesión",
            HttpStatus.BAD_REQUEST,
         );
      }

      if (!(await comparePassword(pBody.Password, getPassword.Password))) {
         throw new HttpException(
            "[VAL]Usuario o contraseña incorrecta",
            HttpStatus.BAD_REQUEST,
         );
      }

      return await this.srvUser.getUser(pBody.UserName);
   }
}
