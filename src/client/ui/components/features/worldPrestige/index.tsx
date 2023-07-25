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
		const [prestigeInteractions, setPrestigeInteractions] = useState<Array<BasePart>>([]);
		const [upgradesInteractions, setUpgradesInteractions] = useState<Array<BasePart>>([]);

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

		useEffect(() => {
			const _prestigeInteractions: Array<BasePart> = [];
			for (const worldPrestigeFolder of Workspace.interactions.worldPrestige.GetChildren()) {
				const pretigeFolder = worldPrestigeFolder.FindFirstChild("prestige") as Folder;
				const vendor = pretigeFolder.FindFirstChild("vendor") as Model;
				const primary = vendor.FindFirstChild("primary") as BasePart;
				_prestigeInteractions.push(primary);
			}
			setPrestigeInteractions(_prestigeInteractions);

			const _upgradesInteractions: Array<BasePart> = [];
			CollectionService.GetTagged("prestigeUpgrade").forEach((interaction) => {
				if (!interaction.IsA("BasePart")) {
					return;
				}

				_upgradesInteractions.push(interaction);
			});
			setUpgradesInteractions(_upgradesInteractions);

			const connections: Array<RBXScriptConnection> = [
				CollectionService.GetInstanceAddedSignal("prestigeUpgrade").Connect((instance) => {
					if (instance.IsA("BasePart")) {
						setUpgradesInteractions([...upgradesInteractions, instance]);
					}
				}),
			];
			for (const worldPrestigeFolder of Workspace.interactions.worldPrestige.GetChildren()) {
				const prestigeFolder = worldPrestigeFolder.FindFirstChild("prestige") as Folder;
				connections.push(
					prestigeFolder.DescendantAdded.Connect((child) => {
						if (child.Name === "primary" && child.IsA("BasePart")) {
							setPrestigeInteractions([...prestigeInteractions, child]);
						}
					}),
				);
			}

			return (): void => connections.forEach((conn) => conn.Disconnect());
		}, []);

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
