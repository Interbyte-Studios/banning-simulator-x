import { ReplicatedStorage, ServerScriptService, StarterPlayer } from "@rbxts/services";
import { Reporters } from "@rbxts/testez";
import TestBootstrap from "@rbxts/testez/src/TestBootstrap";

TestBootstrap.run([ServerScriptService, StarterPlayer, ReplicatedStorage], Reporters.TextReporter, {
	showTimingInfo: true,
});
