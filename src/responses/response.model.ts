import { Type, applyDecorators } from "@nestjs/common";
import {
   ApiBadRequestResponse,
   ApiExtraModels,
   ApiOkResponse,
   ApiUnauthorizedResponse,
   getSchemaPath,
} from "@nestjs/swagger";
import { ResponseDto } from "./response.dto";
import { ErrorDto } from "src/errors/error.dto";

export const ApiModelResponseArray = <TModel extends Type<any>>(
   model: TModel,
) => {
   return applyDecorators(
      ApiExtraModels(ResponseDto, model),
      ApiOkResponse({
         schema: {
            title: "RespuestaDto",
            allOf: [
               { $ref: getSchemaPath(ResponseDto) },
               {
                  properties: {
                     data: {
                        type: "array",
                        items: { $ref: getSchemaPath(model) },
                     },
                  },
               },
            ],
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: "array", default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: "array", default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
   );
};

export const ApiModelResponseObject = <TModel extends Type<any>>(
   model: TModel,
) => {
   return applyDecorators(
      ApiExtraModels(ResponseDto, model),
      ApiOkResponse({
         schema: {
            title: "RespuestaDto",
            $ref: getSchemaPath(ResponseDto),
            properties: {
               data: {
                  $ref: getSchemaPath(model),
               },
            },
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: "object", default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: "object", default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
   );
};

export const ApiModelResponse = (
   tipoDeDato: "number" | "string" | "boolean",
) => {
   return applyDecorators(
      ApiExtraModels(ResponseDto),
      ApiOkResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",

            properties: {
               code: { type: "number" },
               data: { type: tipoDeDato },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: tipoDeDato, default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "RespuestaDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: tipoDeDato, default: null },
               error: { $ref: getSchemaPath(ErrorDto) },
            },
         },
      }),
   );
};
