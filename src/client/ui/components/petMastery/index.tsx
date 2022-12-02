import Roact from "@rbxts/roact";
import { CollectionService, ContextActionService, Players } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { WorldName } from "shared/configs/worlds";
import { isValidWorld } from "shared/util/isValidWorld";

import { PetMasteryInteractPrompt } from "./interactPrompt";
import { PetMasteryMenu } from "./masteryMenu";

const player = Players.LocalPlayer;

interface PetMasteryProps {
	enabled: boolean;
}

/**
 * A handler component to display the pet mastery interface based on the world the player is in.
 */
export const PetMastery = hooks((props: PetMasteryProps, { useState, useEffect }) => {
	if (!props.enabled) {
		return <></>;
	}

	const [interfaceVisible, setInterfaceVisibility] = useState(false);
	const [worldViewing, setWorldViewing] = useState<WorldName>("Ban Land");

	useEffect(() => {
		ContextActionService.BindAction(
			"openPetMastery",
			(_, state) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				const character = player.Character;
				if (character === undefined) {
					return warn;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					return;
				}

				let withinDistance = false;
				let worldToOpen: WorldName | undefined;
				CollectionService.GetTagged("petMasteryVendor").forEach((petVendor) => {
					assert(petVendor.IsA("Model"), `Expected pet mastery vendor "${petVendor.Name}" to be a model.`);

					const primaryPart = petVendor.PrimaryPart;
					assert(primaryPart, `Expected pet mastery vendor "${petVendor.Name}" to have a set PrimaryPart.`);

					const petMasteryFolder = petVendor.Parent as Folder;
					assert(petMasteryFolder, `Expected the parent of the pet mastery vendor "${petVendor.Name} to exist."`);

					const world = petMasteryFolder.Parent as Folder;
					assert(
						world,
						`Expected the extended parent of the pet mastery vendor "${petVendor.Name}" to be a world's interactions folder. `,
					);

					const worldName = world.Name;
					assert(
						isValidWorld(worldName),
						`Expected the world folder parent to the pet mastery vendor "${petVendor.Name}" to be named after a valid world.`,
					);

					const magnitude = humanoidRootPart.Position.sub(primaryPart.Position).Magnitude;
					if (magnitude < 25) {
						withinDistance = true;
						worldToOpen = worldName;
					}
				});

				if (!withinDistance) {
					return;
				}
				assert(worldToOpen !== undefined, `Expected to find the world the player is in to open the pet mastery.`);

				setWorldViewing(worldToOpen);
				setInterfaceVisibility(true);
			},
			false,
			Enum.KeyCode.C,
		);

		return (): void => {
			ContextActionService.UnbindAction("openPetMastery");
		};
	});

	if (interfaceVisible) {
		return <PetMasteryMenu world={worldViewing} hideMenu={(): void => setInterfaceVisibility(false)} />;
	} else {
		return (
			<>
				{CollectionService.GetTagged("petMasteryVendor").map((petVendor) => {
					assert(petVendor.IsA("Model"), `Expected pet mastery vendor "${petVendor.Name}" to be a model.`);

					const primaryPart = petVendor.PrimaryPart;
					assert(primaryPart, `Expected pet mastery vendor "${petVendor.Name}" to have a set PrimaryPart.`);

					const petMasteryFolder = petVendor.Parent as Folder;
					assert(petMasteryFolder, `Expected the parent of the pet mastery vendor "${petVendor.Name} to exist."`);

					const world = petMasteryFolder.Parent as Folder;
					assert(
						world,
						`Expected the extended parent of the pet mastery vendor "${petVendor.Name}" to be a world's interactions folder. `,
					);

					const worldName = world.Name;
					assert(
						isValidWorld(worldName),
						`Expected the world folder parent to the pet mastery vendor "${petVendor.Name}" to be named after a valid world.`,
					);

					return (
						<PetMasteryInteractPrompt
							adornee={primaryPart}
							displayPetMastery={(): void => {
								setWorldViewing(worldName);
								setInterfaceVisibility(true);
							}}
						/>
					);
				})}
			</>
		);
	}
});
