import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { spinWheel, updateSpinWheelInfo } from "server/modules/rodux/spinWheel";
import { remotes } from "shared/remotes";

remotes.Server.Get("spinWheel").SetCallback(withPlayerStore((_, store) => spinWheel(store)));
remotes.Server.Get("spinWheelInfo").Connect(withPlayerStore((_, store) => updateSpinWheelInfo(store)));
