// 数据状态持久化
import { LangEnum } from "@share/enum";
import { StoreState } from "@share/type";
import Store from "electron-store";

let instance: Store<StoreState> | null = null;

/**
 * 初始化store
 * @param params { name: string }
 * @returns
 */
export const initStore = (params: { name: string }) => {
  instance = new Store<StoreState>({
    name: params.name,
    watch: false,
    schema: {
      lang: {
        type: "string",
        default: LangEnum.ZhCN
      }
    }
  });
  return store;
};

type Key = keyof StoreState;

export const store = {
  get(key: Key, defaultValue?: StoreState[Key]) {
    return instance?.get(key) ?? defaultValue;
  },
  set(key: Key, value: StoreState[Key]) {
    instance?.set(key, value);
  }
};
