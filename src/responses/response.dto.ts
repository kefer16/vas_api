import { ErrorDto } from "src/errors/error.dto";

export class ResponseDto<TData> {
   code: number;
   data: TData[] | TData;
   error: ErrorDto;
}
