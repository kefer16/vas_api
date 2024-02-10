import { ObjCompanyResDto } from "src/companies/dto/responses/obj-company-res.dto";
import { ObjUserResDto } from "src/users/dto/responses/obj-user-res.dto";

export class ModuleResDto {
   ModuleId: string;
   Name: string;
   CreationDate: Date;
   IsActive: boolean;
   ObjCompany: ObjCompanyResDto;
   ObjUser: ObjUserResDto;
}
