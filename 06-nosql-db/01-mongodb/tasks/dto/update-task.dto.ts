import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsOptional } from "class-validator";

import { IsString } from "class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;
}
