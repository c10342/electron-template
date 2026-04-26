import ElectronStore from "electron-store";
import { LangEnum } from "@share/enum";
import { defaultLang } from "@share/config";
import { StoreSchema } from "@share/type";

let store: ElectronStore<StoreSchema>;

export const initStore = () => {
  store = new ElectronStore<StoreSchema>({
    defaults: {
      lang: defaultLang as LangEnum
    }
  });
};

export const getStore = <T extends keyof StoreSchema>(key: T): StoreSchema[T] => {
  return store.get(key);
};

export const setStore = <T extends keyof StoreSchema>(key: T, value: StoreSchema[T]): void => {
  store.set(key, value);
};

export const deleteStore = <T extends keyof StoreSchema>(key: T): void => {
  store.delete(key);
};
