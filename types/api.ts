export interface ApiError {
  statusCode: number
  statusMessage: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
} 