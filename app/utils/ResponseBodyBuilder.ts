/**
 * Generic class to build response with status code and body.
 */
export class ResponseBodyBuilder {
  constructor(private readonly statusCode: number,
              private readonly message: string,
              private readonly data?: any) {
  }

  /**
   * Serverless:
   * According to the API Gateway specs, the body content must be stringified
   */
  public bodyToString() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        message: this.message,
        data: this.data,
      }),
    };
  }
}
