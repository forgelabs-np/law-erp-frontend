import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse, PaginatedResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface EmployeePayload {
  username: string;
  email: string;
  mobileNo: string;
  password?: string;
  fullName: string;
  roleId: string;
  designation: string;
  departmentId: string;
  barCouncilNo?: string;
  specialization?: string;
  joiningDate: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
}

export interface EmployeeResponseType extends EmployeePayload {
  id: string;
  isActive: boolean;
}

const getEmployees = () => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<EmployeeResponseType>>>(
    api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES
  );
};

export const useGetEmployeesQuery = () => {
  return useQuery({
    queryKey: [api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES],
    queryFn: getEmployees,
    select: (response) => response?.data?.data,
  });
};

const getEmployeeById = async (id: string) => {
  return LawFirmCRMClient.get<ApiResponse<EmployeeResponseType>>(
    api.EMPLOYEE_MANAGEMENT.GET_BY_ID.replace("{employeeId}", id)
  );
};

export const useEmployeeByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`employee-${id}`],
    enabled: !!id,
    queryFn: () => getEmployeeById(id),
    select: (response) => response?.data?.data,
  });
};

const addEmployee = (data: EmployeePayload) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(api.EMPLOYEE_MANAGEMENT.POST, {
    data,
  });
};

export const useAddEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEmployee,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Employee added successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const updateEmployee = ({
  id,
  data,
}: {
  id: string;
  data: Partial<EmployeePayload>;
}) => {
  return LawFirmCRMClient.put<ApiResponse<any>>(
    api.EMPLOYEE_MANAGEMENT.PUT.replace("{employeeId}", id),
    { data }
  );
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (response, variables) => {
      successNotification(
        response?.data?.message || "Employee updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES],
      });
      queryClient.invalidateQueries({ queryKey: [`employee-${variables.id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const toggleEmployee = (id: string) => {
  return LawFirmCRMClient.patch<ApiResponse<any>>(
    api.EMPLOYEE_MANAGEMENT.TOGGLE.replace("{employeeId}", id)
  );
};

export const useToggleEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleEmployee,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Employee status updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const changeEmployeeRole = ({ id, roleId }: { id: string; roleId: string }) => {
  return LawFirmCRMClient.patch<ApiResponse<any>>(
    api.EMPLOYEE_MANAGEMENT.CHANGE_ROLE.replace("{employeeId}", id),
    { data: { roleId } }
  );
};

export const useChangeEmployeeRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeEmployeeRole,
    onSuccess: (response, variables) => {
      successNotification(
        response?.data?.message || "Employee role updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.EMPLOYEE_MANAGEMENT.GET_EMPLOYEES],
      });
      queryClient.invalidateQueries({ queryKey: [`employee-${variables.id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
