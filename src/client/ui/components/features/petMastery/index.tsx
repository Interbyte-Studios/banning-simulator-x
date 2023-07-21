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

	if (props.isVisible) {
		return <PetMasteryMenu world={worldViewing} hideMenu={(): void => props.setVisibility(false)} />;
	} else {
		return (
			<>
				{CollectionService.GetTagged("petMasteryVendor").map((petVendor) => {
					assert(petVendor.IsA("Model"), `Expected pet mastery vendor "${petVendor.Name}" to be a model.`);

					const primaryPart = petVendor.PrimaryPart;
					if (primaryPart === undefined) {
						return <></>;
					}

					return (
						<PetMasteryInteractPrompt
							adornee={primaryPart}
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
