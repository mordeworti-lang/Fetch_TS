export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface HttpError {
  message: string;
  status: number;
}
