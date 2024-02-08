import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { GetOpertorsDto } from "./dto/get-operators.dto";
import * as sql from "mssql";
import { GetOpertorDto } from "./dto/get-operator.dto";

@Injectable()
export class OperatorsService {
   constructor(private mssql: MSSQLService) {}

   async getOperators(): Promise<GetOpertorsDto[]> {
      const result = await this.mssql.executeProcedureList(
         "spGetOperators",
         [],
      );

      const resultMapper: GetOpertorsDto[] = result.map(
         (item) =>
            ({
               OperatorId: item.OperatorId ?? "",
               Name: item.Name ?? "",
            }) as GetOpertorsDto,
      );

      return resultMapper;
   }

   async getOperator(id: string): Promise<GetOpertorDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "peOperatorId",
            typeVariable: sql.UniqueIdentifier,
            value: id,
         },
      ];
      const result = await this.mssql.executeProcedure(
         "spGetOperator",
         parameters,
      );
      if (!result) {
         return {} as GetOpertorsDto;
      }
      const resultMapper: GetOpertorDto = {
         OperatorId: result.OperatorId ?? "",
         Name: result.Name ?? "",
      } as GetOpertorDto;

      return resultMapper;
   }
}
