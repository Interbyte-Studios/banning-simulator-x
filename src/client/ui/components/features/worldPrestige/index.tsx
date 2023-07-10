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

		if (props.isVisible) {
			if (props.viewType === WorldPrestigeViewType.Prestige) {
				return <WorldPrestigePath worldName={viewingWorld} setVisibility={props.setVisibility} />;
			} else {
				return <WorldPrestigeUpgrades worldName={viewingWorld} setVisibility={props.setVisibility} />;
			}
		} else {
			return (
				<>
					{Workspace.interactions.worldPrestige.GetChildren().map((worldPrestigeFolder) => {
						const prestige = worldPrestigeFolder.FindFirstChild("prestige") as Folder;

						const prestigeVendor = prestige.FindFirstChild("vendor") as Model;
						const prestigePrimaryPart = prestigeVendor.FindFirstChild("primary") as BasePart;
						assert(
							prestigePrimaryPart,
							`Expected prestige vendor from ${worldPrestigeFolder.Name} to have a primary part.`,
						);

						return (
							<>
								<WorldPrestigeInteractPrompt
									adornee={prestigePrimaryPart}
									display={(): void => {
										props.setViewType(WorldPrestigeViewType.Prestige);
										props.setVisibility(true);
									}}
									interactType={WorldPrestigeViewType.Prestige}
								/>
								{CollectionService.GetTagged("prestigeUpgrade").map((interaction) => {
									if (!interaction.IsA("BasePart")) {
										return <></>;
									}

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
					})}
				</>
			);
		}
	},
);
