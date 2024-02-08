// 数据状态持久化
import { StoreState } from "@share/type";
import Store from "electron-store";

export let store: Store<StoreState> | null = null;

export const initStore = (params: { name: string }) => {
  store = new Store<StoreState>({
    name: params.name,
    watch: false,
    schema: {
      lang: {
        type: "string",
        default: ""
      }
    }
  });
  console.log(`store存放位置:${store.path}`);
  // store.onDidChange("lang", (value) => {
  //   // todo
  // });
  return store;
};
