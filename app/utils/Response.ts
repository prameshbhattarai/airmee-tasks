import {ResponseModel} from "../interface/ResponseModel";
import {ResponseBodyBuilder} from "./ResponseBodyBuilder";

/**
 * Generic Response wrapper class.
 */
export class Response {

  public static success(data: any): ResponseModel {
    const result = new ResponseBodyBuilder(200, 'success', data);
    return result.bodyToString();
  }

  public static error(message: string, statusCode = 500): ResponseModel {
    const result = new ResponseBodyBuilder(statusCode, message);
    return result.bodyToString();
  }
}
