import {ResponseModel} from "./ResponseModel";
import {ResponseBodyBuilder} from "./ResponseBodyBuilder";

/**
 * Generic Response wrapper class.
 */
export class Response {

  static success(data: any): ResponseModel {
    const result = new ResponseBodyBuilder(200, 'success', data);
    return result.bodyToString();
  }

  static error(message: string, statusCode = 500): ResponseModel {
    const result = new ResponseBodyBuilder(statusCode, message);
    return result.bodyToString();
  }
}
