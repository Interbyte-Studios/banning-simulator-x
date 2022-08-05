/* eslint-disable no-constant-condition */

import { RunService } from "@rbxts/services";
import { playMusic } from "client/util/playSound";

task.spawn(() => {
	RunService.RenderStepped.Connect(() => {});
});
