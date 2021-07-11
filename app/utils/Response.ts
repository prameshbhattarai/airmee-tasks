import {ResponseModel} from "../interface/ResponseModel";
import {ResponseBodyBuilder} from "./ResponseBodyBuilder";

/**
 * Generic Response wrapper class.
 */
export class Response {

  /**
   * Wrapper function to provide success response.
   * @param data
   */
  public static success(data: any): ResponseModel {
    const result = new ResponseBodyBuilder(200, 'success', data);
    return result.bodyToString();
  }

  /**
   * Wrapper function to provide error response.
   * @param message
   * @param statusCode
   */
  public static error(message: string, statusCode = 500): ResponseModel {
    const result = new ResponseBodyBuilder(statusCode, message);
    return result.bodyToString();
  }
}
