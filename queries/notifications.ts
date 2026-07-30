import { Notification } from "@/types/types";
import { demoNotifications } from "@/data/temp";

export class NotificationQuery {
  // ✅ GET ALL NOTIFICATIONS (MOCKED)
  getAll = async (): Promise<Notification[]> => {
    return demoNotifications;
  };
}
