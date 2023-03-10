import { createContext, useContext, useState } from "react";

export const Store = createContext();

export const initialStore = {
  lockScroll: false,
};

export const useStoreInitial = (initial = {}) => {
  const state = useState({ ...initialStore, ...initial });

  return state;
};

export const useStore = () => {
  const [store, setStore] = useContext(Store);

  return { store, setStore };
};
