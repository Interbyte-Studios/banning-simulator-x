import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { spinWheel, updateSpinWheelInfo } from "server/modules/rodux/spinWheel";
import { remotes } from "shared/remotes";

remotes.Server.Create("spinWheel").SetCallback(withPlayerStore((_, store) => spinWheel(store)));
remotes.Server.Create("spinWheelInfo").Connect(withPlayerStore((_, store) => updateSpinWheelInfo(store)));
