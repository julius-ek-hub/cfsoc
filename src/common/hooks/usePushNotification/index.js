import useFetch from "../useFetch";
import useCommonSettings from "../useSettings";

const usePushNotification = () => {
  const { post } = useFetch("/push-notification");
  const { update, push_notification } = useCommonSettings();

  async function registerServiceWorker() {
    try {
      const register = await navigator.serviceWorker.register("./worker.js", {
        scope: "/",
      });

      const publicVapidKey =
        "BIaHciU-RpHaVUjPhRxcqBIuEQu8aTv_q7StQ4FmEBP6-0qg9WhowTE6IUOcuANuNdS0ssXc-K-YYV-q9OSQLY8";

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });

      if (push_notification) return;

      const { json } = await post(
        "/subscribe?device=" + navigator.userAgent.toLocaleLowerCase(),
        subscription
      );

      update("push_notification", json, false);
    } catch (error) {
      console.log(error);
      update("push_notification", undefined, false);
    }
  }
  return {
    registerServiceWorker,
  };
};

export default usePushNotification;
