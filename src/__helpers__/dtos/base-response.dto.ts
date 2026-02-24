import { Expose } from 'class-transformer';

export class BaseResponseDto<T = unknown> {
  @Expose()
  Success: boolean;

  @Expose()
  Message: string;

  @Expose()
  Object: T | null;

  @Expose()
  Errors: string[] | null;

  constructor(
    success: boolean,
    message: string,
    object: T | null = null,
    errors: string[] | null = null,
  ) {
    this.Success = success;
    this.Message = message;
    this.Object = object;
    this.Errors = errors;
  }

  static ok<T>(
    message = 'Success',
    object: T | null = null,
  ): BaseResponseDto<T> {
    return new BaseResponseDto<T>(true, message, object, null);
  }

  static fail(
    message = 'Failed',
    errors: string[] = [],
  ): BaseResponseDto<null> {
    return new BaseResponseDto<null>(false, message, null, errors);
  }
}
