export class PaginatedResponseDto<T = unknown> {
  Success: boolean;
  Message: string;
  Object: T[];
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  Errors: string[] | null;

  constructor(
    message: string,
    object: T[],
    pageNumber: number,
    pageSize: number,
    totalSize: number,
  ) {
    this.Success = true;
    this.Message = message;
    this.Object = object;
    this.PageNumber = pageNumber;
    this.PageSize = pageSize;
    this.TotalSize = totalSize;
    this.Errors = null;
  }

  static ok<T>(
    message: string,
    object: T[],
    pageNumber: number,
    pageSize: number,
    totalSize: number,
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto<T>(
      message,
      object,
      pageNumber,
      pageSize,
      totalSize,
    );
  }
}
