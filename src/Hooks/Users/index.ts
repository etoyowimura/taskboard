import { useQuery } from "react-query";
import { TUsersGetParams, userController } from "../../API/LayoutApi/users";

export const useUserData = ({
  name,
  team,
  role,
  page,
  page_size,
}: TUsersGetParams) => {
  return useQuery(
    [`users/admins/`, { name, team, role, page, page_size }],
    () => userController.read({ name, team, role, page, page_size }),
    { refetchOnWindowFocus: false }
  );
};

export const useUserOne = (userId?: number | string) => {
  return useQuery(
    [`user/${userId || "all"}`, userId],
    () => userController.userOne(userId),
    { refetchOnWindowFocus: false }
  );
};

export const useCheckUser = (username: string): any => {
  return useQuery(
    [`user/${username}/`],
    () => userController.CheckUsername(username),
    { refetchOnWindowFocus: false }
  );
};
