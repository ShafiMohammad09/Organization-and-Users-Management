import { toast } from "sonner";

export const useNotifications = () => {
  const notifications = {
    organizationAdded: (name: string) => {
      toast.success(`Organization "${name}" added successfully`);
    },
    organizationDeleted: (name: string) => {
      toast.success(`Organization "${name}" deleted successfully`);
    },
    userAdded: (name: string) => {
      toast.success(`User "${name}" added successfully`);
    },
    userDeleted: (name: string) => {
      toast.success(`User "${name}" deleted successfully`);
    },
    welcome: (name: string) => {
      toast.success(`Welcome, ${name}!`);
    },
    error: (message: string) => {
      toast.error(message);
    },
    info: (message: string) => {
      toast.info(message);
    },
  };

  return notifications;
};
