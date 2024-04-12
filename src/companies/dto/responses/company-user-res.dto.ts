import { UserResponseDto } from "src/users/dto/responses/user-response.dto";

export class CompanyUserResDto {
   CompanyId?: string = "";
   ShortName?: string = "";
   FullName?: string = "";
   Description?: string = "";
   Email?: string = "";
   Page?: string = "";
   CreationDate?: Date = new Date();
   IsActive?: boolean = false;
   FkUserId?: string = "";
   DtoUser?: UserResponseDto = new UserResponseDto();
}
