// 数据状态持久化
import { LangEnum } from "@share/enum";
import { StoreState } from "@share/type";
import Store from "electron-store";

export let store: Store<StoreState> | null = null;

/**
 * 初始化store
 * @param params { name: string }
 * @returns
 */
export const initStore = (params: { name: string }) => {
  store = new Store<StoreState>({
    name: params.name,
    watch: false,
    schema: {
      lang: {
        type: "string",
        default: LangEnum.ZhCN
      }
    }
  });
  console.log(`store存放位置:${store.path}`);
  // store.onDidChange("lang", (value) => {
  //   // todo
  // });
  return store;
};
