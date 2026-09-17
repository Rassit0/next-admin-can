export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly errors?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
