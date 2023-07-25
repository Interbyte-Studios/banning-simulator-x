// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName } from "shared/configs/worlds";

import { PetMasteryInteractPrompt } from "./interactPrompt";
import { PetMasteryMenu } from "./masteryMenu";

interface PetMasteryProps {
	isVisible: boolean;
	setVisibility: (visible: boolean) => void;
}

/**
 * A handler component to display the pet mastery interface based on the world the player is in.
 */
export const PetMastery = hooks((props: PetMasteryProps, { useState, useEffect }) => {
	const [worldViewing, setWorldViewing] = useState<WorldName>("Ban Land");
	const [interaction, setInteractions] = useState<Array<BasePart>>([]);

	useEffect(() => {
		if (!props.isVisible) {
			return;
		}

		const currentWorld = getCurrentWorld();
		if (currentWorld === undefined) {
			throw `Expected player to be in a valid world to open mastery.`;
		}

		setWorldViewing(currentWorld);
	}, [props.isVisible]);

	useEffect(() => {
		const inters: Array<BasePart> = [];
		for (const petVendor of CollectionService.GetTagged("petMasteryVendor")) {
			if (petVendor.IsA("Model")) {
				const primaryPart = petVendor.PrimaryPart;
				if (primaryPart !== undefined) {
					inters.push(primaryPart);
				}
			}
		}
		setInteractions(inters);

		const connection = CollectionService.GetInstanceAddedSignal("petMasteryVendor").Connect((petVendor) => {
			if (petVendor.IsA("Model")) {
				const primaryPart = petVendor.PrimaryPart;
				if (primaryPart !== undefined) {
					setInteractions([...inters, primaryPart]);
				}
			}
		});
		return (): void => connection.Disconnect();
	}, []);

	if (props.isVisible) {
		return <PetMasteryMenu world={worldViewing} hideMenu={(): void => props.setVisibility(false)} />;
	} else {
		return (
			<>
				{interaction.map((interaction) => {
					return (
						<PetMasteryInteractPrompt
							adornee={interaction}
							displayPetMastery={(): void => {
								props.setVisibility(true);
							}}
						/>
					);
				})}
			</>
		);
	}
});
