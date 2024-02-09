import { ErrorResDto } from "src/errors/error-res.dto";

export class ResponseResDto<TData> {
   code: number;
   data: TData[] | TData;
   error: ErrorResDto;
}
