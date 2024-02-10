import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { UserResDto } from "./dto/responses/user-res.dto";
import { UniqueIdentifier, VarChar } from "mssql";
import { CreateUserReqDto } from "./dto/requests/create-user-req.dto";
import { UpdateUserReqDto } from "./dto/requests/update-user-req.dto";

@Injectable()
export class UsersService {
   constructor(private srvMSSQL: MSSQLService) {}

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

   async createModule(pBody: CreateUserReqDto): Promise<UserResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piName",
            typeVariable: VarChar(300),
            value: pBody.UserId,
         },
      ];

      const result = await this.srvMSSQL.executeProcedure(
         "spCreateModule",
         parameters,
      );

      const resultMapper: UserResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
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
