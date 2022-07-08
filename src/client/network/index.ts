import { remotes } from "shared/remotes";

export const hatchEgg = remotes.Client.GetNamespace("eggs").Get("hatchEgg");
export const toggleAuto = remotes.Client.GetNamespace("eggs").Get("toggleAuto");
