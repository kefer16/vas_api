import { Injectable } from "@nestjs/common";
import { MSSQLService } from "src/db/mssql.service";
import { GetCompaniesResDto } from "./dto/responses/get-companies-res.dto";

@Injectable()
export class CompaniesService {
   constructor(private mssql: MSSQLService) {}

   async getCompanies(): Promise<GetCompaniesResDto[]> {
      const result = await this.mssql.executeProcedureList("spGetCompanies");

      const resultMapper: GetCompaniesResDto[] = result.map(
         (item) =>
            ({
               CompanyId: item.CompanyId ?? "",
               Name: item.Name ?? "",
               Email: item.Email ?? "",
               CreationDate: item.CreationDate ?? new Date(),
               IsActive: item.IsActive ?? false,
            }) as GetCompaniesResDto,
      );

      return resultMapper;
   }
}
