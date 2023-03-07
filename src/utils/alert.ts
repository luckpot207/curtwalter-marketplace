// import { store } from "../api/store";

export function addNotification(
  title: string,
  subtitle?: string,
  type: "success" | "error" = "success",
  duration: number = 5000
) {
  const id = Math.random().toString(10).substring(2);
  // store.dispatch?.({
  //   type: "AddNotification",
  //   alert: {
  //     id,
  //     title,
  //     subtitle,
  //     type,
  //   },
  // });
  // setTimeout(() => {
  //   store.dispatch?.({
  //     type: "RemoveNotification",
  //     id,
  //   });
  // }, duration);
}
