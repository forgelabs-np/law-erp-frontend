import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarService } from "../services/calendarService";
import { Task } from "../types/Task";

const QUERY_KEY = ["calendarTasks"];

export const useCalendarTasks = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: calendarService.getTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      calendarService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
