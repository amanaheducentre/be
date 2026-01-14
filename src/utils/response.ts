import type { ApiError, ApiResponse } from "../schemas/api.schema.js";

export function ok<T>(data: T, status = 200, message = "OK"): ApiResponse<T> {
  return {
    ok: true,
    status,
    message,
    data,
  };
}

export function fail(status: number, errors: Array<ApiError>): ApiResponse {
  return {
    ok: false,
    status,
    message: "An error occured",
    errors,
  };
}
