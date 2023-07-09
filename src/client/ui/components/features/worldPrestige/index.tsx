import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName } from "shared/configs/worlds";

import { WorldPrestigeInteractPrompt } from "./interactPrompt";
import { WorldPrestigePath } from "./prestige";
import { WorldPrestigeViewType } from "./prestigeEnum";

/**
 * A feature allowing the player to prestige any given world for given rewards.
 */
export const WorldPrestige = hooks(
	(props: { isVisible: boolean; setVisibility: (value: boolean) => void }, { useState, useEffect }) => {
		const [viewingWorld, setViewingWorld] = useState<WorldName>("Ban Land");
		const [viewType, setViewType] = useState<WorldPrestigeViewType>(WorldPrestigeViewType.Prestige);

		useEffect(() => {
			if (!props.isVisible) {
				return;
			}

			const currentWorld = getCurrentWorld();
			if (currentWorld === undefined) {
				throw `Could not display world prestige because the current world is undefined.`;
			}

			if (currentWorld === viewingWorld) {
				return;
			}

			setViewingWorld(currentWorld);
		}, [props.isVisible]);

		if (props.isVisible) {
			if (viewType === WorldPrestigeViewType.Prestige) {
				return <WorldPrestigePath worldName={viewingWorld} setVisibility={props.setVisibility} />;
			}
			return <></>;
		} else {
			return (
				<>
					{Workspace.interactions.worldPrestige.GetChildren().map((worldPrestigeFolder) => {
						const prestige = worldPrestigeFolder.FindFirstChild("prestige") as Folder;
						const upgrades = worldPrestigeFolder.FindFirstChild("upgrades") as Folder;

						const prestigeVendor = prestige.FindFirstChild("vendor") as Model;
						const prestigePrimaryPart = prestigeVendor.FindFirstChild("primary") as BasePart;
						assert(
							prestigePrimaryPart,
							`Expected prestige vendor from ${worldPrestigeFolder.Name} to have a primary part.`,
						);

						const upgradesVendor = upgrades.FindFirstChild("vendor") as Model;
						const upgradesPrimaryPart = upgradesVendor.FindFirstChild("primary") as BasePart;
						assert(
							upgradesPrimaryPart,
							`Expected upgrades vendor from ${worldPrestigeFolder.Name} to have a primary part.`,
						);

						return (
							<>
								<WorldPrestigeInteractPrompt
									adornee={prestigePrimaryPart}
									display={(): void => {
										setViewType(WorldPrestigeViewType.Prestige);
										props.setVisibility(true);
									}}
									interactType={WorldPrestigeViewType.Prestige}
								/>
								<WorldPrestigeInteractPrompt
									adornee={upgradesPrimaryPart}
									display={(): void => {
										setViewType(WorldPrestigeViewType.Upgrades);
										props.setVisibility(true);
									}}
									interactType={WorldPrestigeViewType.Upgrades}
								/>
							</>
						);
					})}
				</>
			);
		}
	},
);
