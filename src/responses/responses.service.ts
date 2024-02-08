import { Injectable } from "@nestjs/common";
import { ResponseDto } from "./response.dto";
import { ErrorDto } from "src/errors/error.dto";

@Injectable()
export class ResponsesService<TData> {
   repuestaCorrecta(_data: TData): ResponseDto<TData> {
      const result = new ResponseDto<TData>();
      result.code = 200;
      result.data = _data;
      result.error = new ErrorDto(false, "0", "");
      return result;
   }
}
