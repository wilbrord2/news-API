import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';
import { EVK, NODE_ENV } from './__helpers__';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    [EVK.NODE_ENV]: Joi.string()
      .required()
      .valid(...Object.values(NODE_ENV).filter((item) => isNaN(Number(item)))),
    [EVK.PORT]: Joi.number().required(),
    [EVK.SWAGGER_USER]: Joi.string().required(),
    [EVK.SWAGGER_PASSWORD]: Joi.string().required(),
    [EVK.DATABASE_NAME]: Joi.string().required(),
    [EVK.DATABASE_HOST]: Joi.string().required(),
    [EVK.DATABASE_PORT]: Joi.number().required(),
    [EVK.JWT_AT_SECRET]: Joi.string().required(),
    [EVK.JWT_AT_EXPIRED_PERIOD]: Joi.string().required(),
  }),
};
