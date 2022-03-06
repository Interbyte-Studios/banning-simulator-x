import { Reporters } from "@rbxts/testez";
import TestBootstrap from "@rbxts/testez/src/TestBootstrap";

TestBootstrap.run([game], Reporters.TextReporter, {
	showTimingInfo: true,
});
