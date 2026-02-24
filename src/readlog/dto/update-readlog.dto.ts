import { PartialType } from '@nestjs/swagger';
import { CreateReadlogDto } from './create-readlog.dto';

export class UpdateReadlogDto extends PartialType(CreateReadlogDto) {}
