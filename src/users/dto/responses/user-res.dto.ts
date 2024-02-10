import { ObjCompanyResDto } from "src/companies/dto/responses/obj-company-res.dto";
import { ObjUserResDto } from "./obj-user-res.dto";

export class UserResDto {
   FirstName: string;
   SecondName: string;
   FirstLastName: string;
   SecondLastName: string;
   UserName: string;
   Password: string;
   Email: string;
   Phone: string;
   Photo: string;
   Address: string;
   CreationDate: Date;
   IsActive: boolean;
   ObjCompany: ObjCompanyResDto;
   ObjUser: ObjUserResDto;
}
