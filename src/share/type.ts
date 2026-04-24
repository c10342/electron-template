import { OpenDialogOptions } from "electron";
import { LangEnum } from "./enum";

export interface OpenDialogParams extends OpenDialogOptions {
  modal?: boolean;
}

export interface StoreSchema {
  locale: LangEnum;
}
