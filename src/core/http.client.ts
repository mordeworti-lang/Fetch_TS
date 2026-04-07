import { ApiResponse } from '@/types';
import { ResponseBuilder } from './utils';

const parseResponseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const fetchData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return ResponseBuilder.httpError<T>(response.status, response.statusText);
    }

    const body = await parseResponseBody(response);

    if (body === null || body === undefined) {
      return ResponseBuilder.emptyBody<T>(response.status);
    }

    return ResponseBuilder.success<T>(body as T, response.status);
  } catch {
    return ResponseBuilder.networkError<T>();
  }
};
