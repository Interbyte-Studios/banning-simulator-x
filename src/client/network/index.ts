import { remotes } from "shared/remotes";

export const requestHatch = remotes.Client.GetNamespace("eggs").Get("requestHatch");
export const relayHatch = remotes.Client.GetNamespace("eggs").Get("relayHatch");
