import { Injectable } from "@nestjs/common";
import { MSSQLService } from "src/mssql/mssql.service";
import { GetPrivilegesResDto } from "./dto/responses/get-privileges-res.dto";

@Injectable()
export class PrivilegesService {
   constructor(private mssql: MSSQLService) {}
   async getPrivileges(): Promise<GetPrivilegesResDto[]> {
      const result = await this.mssql.executeProcedureList("spGetPrivileges");

      const resultMapper: GetPrivilegesResDto[] = result.map(
         (item) =>
            ({
               PrivilegeId: item.PrivilegeId ?? "",
               Name: item.Name ?? "",
               Abbreviation: item.Abbreviation ?? "",
               CreationDate: item.CreationDate ?? new Date(),
               IsActive: item.IsActive ?? false,
            }) as GetPrivilegesResDto,
      );

      return resultMapper;
   }
}
