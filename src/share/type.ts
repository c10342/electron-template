import { OpenDialogOptions, SaveDialogOptions } from "electron";
import { LangEnum } from "./enum";

export interface OpenDialogParams extends OpenDialogOptions {
  modal?: boolean;
}

export interface SaveDialogParams extends SaveDialogOptions {
  modal?: boolean;
}

export interface StoreSchema {
  lang: LangEnum;
}

export interface NotificationParams {
  title: string;
  body?: string;
  subtitle?: string;
  silent?: boolean;
  icon?: string;
}

export interface ScreenInfo {
  width: number;
  height: number;
  scaleFactor: number;
  primaryDisplay: {
    id: number;
    bounds: { x: number; y: number; width: number; height: number };
    workArea: { x: number; y: number; width: number; height: number };
    scaleFactor: number;
  };
}
