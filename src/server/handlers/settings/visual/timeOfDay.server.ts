import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleTimeOfDay } from "shared/rodux/settings";

const toggleTimeOfDayRemote = remotes.Server.GetNamespace("settings").GetNamespace("visual").Get("toggleTimeOfDay");
toggleTimeOfDayRemote.Connect(withPlayerStore((_, store, timeOfDay) => store.dispatch(toggleTimeOfDay(timeOfDay))));
