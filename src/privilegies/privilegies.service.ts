import { Injectable } from "@nestjs/common";
import { MSSQLService } from "src/mssql/mssql.service";
import { GetPrivilegiesResDto } from "./dto/responses/get-privilegies-res.dto";

@Injectable()
export class PrivilegiesService {
   constructor(private mssql: MSSQLService) {}
   async getPrivilegies(): Promise<GetPrivilegiesResDto[]> {
      const result = await this.mssql.executeProcedureList("spGetPrivilegies");

      const resultMapper: GetPrivilegiesResDto[] = result.map(
         (item) =>
            ({
               PrivilegeId: item.PrivilegeId ?? "",
               Name: item.Name ?? "",
               Abbreviation: item.Abbreviation ?? "",
               CreationDate: item.CreationDate ?? new Date(),
               IsActive: item.IsActive ?? false,
            }) as GetPrivilegiesResDto,
      );

      return resultMapper;
   }
}
