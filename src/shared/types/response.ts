export type ApiResponse<T> = {
  success: boolean;
  message: string;
  responseCode: number;
  data: T;
};

export type PaginatedResponse<T> = {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiErrorResponse = {
  response?: {
    data?: {
      error: {
        errorCode: number;
        errorMessage: string;
      };
      responseCode: number;
      timeStamp: string;
      message?: string;
    };
  };
};

export type ApiGenericGetListResponse = {
  id: string;
  code: string | null;
  name: string;
  nameLoc: string;
};

export type ApiGenericDropdownResponse = {
  id: string;
  name: string;
};
