import { Notification } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { demoNotifications } from "@/data/temp";

export class NotificationQuery {
  // ✅ GET ALL NOTIFICATIONS (MOCKED)
  getAll = async (): Promise<Notification[]> => {
    return demoNotifications;
  };
}

export function useNotificationsQuery() {
  const notificationQuery = new NotificationQuery();
  return useQuery({
    queryKey: queryKeys.notifications.all(),
    queryFn: notificationQuery.getAll,
  });
}
