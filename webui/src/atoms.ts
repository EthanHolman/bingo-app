import { atom } from "jotai";
import { DEFAULT_APP_TITLE } from "./settings";
import { MenuItem } from "./types";

export const CurrentTitleAtom = atom(DEFAULT_APP_TITLE);
export const ExtraMenuItemsAtom = atom<MenuItem[]>([]);
