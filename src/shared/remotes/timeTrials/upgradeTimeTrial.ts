import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isTimeTrialUpgrade, TimeTrialUpgradeType } from "shared/configs/timeTrials";
import { isWorldName, WorldName } from "shared/configs/worlds";

export const upgradeTimeTrialsDefinition = Net.Definitions.ClientToServerEvent<
	[worldName: WorldName, upgradeName: TimeTrialUpgradeType]
>([createTypeChecker(isWorldName, isTimeTrialUpgrade)]);
export type UpgradeTimeTrialsDefinition = typeof upgradeTimeTrialsDefinition;
