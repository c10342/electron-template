// 数据状态持久化
import Store from "electron-store";

interface StroeState {
  lang: string;
}

export let store: Store<StroeState> | null = null;

export const initStore = (params: { name: string }) => {
  store = new Store<StroeState>({
    name: params.name,
    watch: false,
    schema: {
      lang: {
        type: "string",
        default: ""
      }
    }
  });
  // store.onDidChange("lang", (value) => {
  //   // todo
  // });
  return store;
};
