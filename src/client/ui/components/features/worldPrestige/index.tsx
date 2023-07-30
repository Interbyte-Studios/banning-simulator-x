import Roact from "@rbxts/roact";
import { CollectionService, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName } from "shared/configs/worlds";

import { WorldPrestigeInteractPrompt } from "./interactPrompt";
import { WorldPrestigePath } from "./prestige";
import { WorldPrestigeViewType } from "./prestigeEnum";
import { WorldPrestigeUpgrades } from "./upgrades";

/**
 * A feature allowing the player to prestige any given world for given rewards.
 */
export const WorldPrestige = hooks(
	(
		props: {
			isVisible: boolean;
			setVisibility: (value: boolean) => void;
			viewType: WorldPrestigeViewType;
			setViewType: (viewType: WorldPrestigeViewType) => void;
		},
		{ useState, useEffect },
	) => {
		const [viewingWorld, setViewingWorld] = useState<WorldName>("Ban Land");

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

		const prestigeInteractions: Array<BasePart> = [];
		for (const worldPrestigeFolder of Workspace.interactions.worldPrestige.GetChildren()) {
			const pretigeFolder = worldPrestigeFolder.FindFirstChild("prestige") as Folder;
			const vendor = pretigeFolder.FindFirstChild("vendor") as Model;
			const primary = vendor.FindFirstChild("primary") as BasePart;
			prestigeInteractions.push(primary);
		}

		const upgradesInteractions: Array<BasePart> = [];
		CollectionService.GetTagged("prestigeUpgrade").forEach((interaction) => {
			if (!interaction.IsA("BasePart")) {
				return;
			}

			upgradesInteractions.push(interaction);
		});

		if (props.isVisible) {
			if (props.viewType === WorldPrestigeViewType.Prestige) {
				return <WorldPrestigePath worldName={viewingWorld} setVisibility={props.setVisibility} />;
			} else {
				return <WorldPrestigeUpgrades worldName={viewingWorld} setVisibility={props.setVisibility} />;
			}
		} else {
			return (
				<>
					{prestigeInteractions.map((interaction) => {
						return (
							<>
								<WorldPrestigeInteractPrompt
									adornee={interaction}
									display={(): void => {
										props.setViewType(WorldPrestigeViewType.Prestige);
										props.setVisibility(true);
									}}
									interactType={WorldPrestigeViewType.Prestige}
								/>
							</>
						);
					})}
					{upgradesInteractions.map((interaction) => {
						return (
							<WorldPrestigeInteractPrompt
								adornee={interaction}
								display={(): void => {
									props.setViewType(WorldPrestigeViewType.Upgrades);
									props.setVisibility(true);
								}}
								interactType={WorldPrestigeViewType.Upgrades}
							/>
						);
					})}
				</>
			);
		}
	},
);
