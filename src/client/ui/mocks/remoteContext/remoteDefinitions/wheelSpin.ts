import { SpinWheelDefinition } from "shared/remotes/spinWheel";
import { SpinWheelInfoDefinition } from "shared/remotes/spinWheelnfo";

import { fakeFunctionCall } from "../fakeFunctionCall";
import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the wheel spin remote functions.
 */
export const wheelSpinRemoteContext = {
	spinWheel: fakeFunctionCall<SpinWheelDefinition>("spinWheel", () => 1),
	spinWheelInfo: fakeRemoteCall<SpinWheelInfoDefinition>("spinWheelInfo"),
};
