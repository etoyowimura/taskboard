import { useQuery } from "react-query";
import { TTasksGetParams, taskController } from "../../API/LayoutApi/tasks";

export const useTasks = ({
  search,
  status,
  team,
  page,
  page_size,
}: TTasksGetParams) => {
  return useQuery(
    [`tasks/`, search, status, team, page, page_size],
    () => taskController.read({ search, status, team, page, page_size }),
    { refetchOnWindowFocus: false }
  );
};

export const useTaskOne = (taskId: number | undefined) => {
  return useQuery(
    [`task/${taskId}/`, taskId],
    () => taskController.taskOne(taskId),
    { refetchOnWindowFocus: false }
  );
};

export const useTaskHistory = (Id: number | undefined) => {
  return useQuery(
    [`customer/${Id}/`, Id],
    () => taskController.getHistory(Id),
    { refetchOnWindowFocus: false }
  );
};
