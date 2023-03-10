import { useStore } from "Common/hooks/store";
import { useEffect } from "react";

export const useLoader = () => {
  const { store, setStore } = useStore();
  const { user, loaded } = store;

  useEffect(() => {
    user && setStore((prev) => ({ ...prev, loaded: true }));
  }, [user, setStore]);

  return { loaded };
};
