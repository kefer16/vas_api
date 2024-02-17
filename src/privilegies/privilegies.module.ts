import { Module } from "@nestjs/common";
import { PrivilegiesController } from "./privilegies.controller";
import { PrivilegiesService } from "./privilegies.service";

@Module({
   imports: [],
   controllers: [PrivilegiesController],
   providers: [PrivilegiesService],
})
export class PrivilegiesModule {}
