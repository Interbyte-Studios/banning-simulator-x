import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { WorldName } from "shared/configs/worlds";

import { IndexEggScroll } from "./eggs/eggScroll";
import { IndexEggView } from "./eggs/eggView";
import { PetMasteryIndexHeader } from "./misc/header";
import { IndexPetScroll } from "./pets/petScroll";
import { IndexPetView } from "./pets/petView";
import { ReturnToEggScroll } from "./pets/returnToEggScroll";

interface PetMasteryMenuProps {
	world: WorldName;
	hideMenu: () => void;
}

/**
 * Displays all the pets of a given world, and accolades for each one that give rewards.
 */
export const PetMasteryMenu = hooks((props: PetMasteryMenuProps, { useState }) => {
	const [eggToView, setEggToView] = useState<EggName | undefined>(undefined); // default should be undefined.
	const [petToView, setPetToView] = useState<number | undefined>(undefined); // default should be undefined.
	const [petViewType, setPetViewType] = useState<Variants | undefined>(undefined);
	const [viewingChallenges, setViewingChallenges] = useState(false);

	if (petViewType !== undefined) {
		assert(eggToView, `Expected PetMasteryMenu "eggToView" stateful value to be defined.`);

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.61)}
				Image={assetIds.images.ui.index.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.3} />
				<PetMasteryIndexHeader />
				<ReturnToEggScroll returnToSelection={(): void => setPetViewType(undefined)} />
				<IndexPetScroll
					egg={eggToView}
					currentPet={petToView}
					currentVariant={petViewType}
					displayPet={(pet: number | undefined): void => setPetToView(pet)}
				/>
				<IndexPetView
					pet={petToView}
					currentVariant={petViewType}
					displayChallenges={(): void => setViewingChallenges(true)}
					hideInfo={(): void => setPetToView(undefined)}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.075)}
					minimizedSize={0.075}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</imagelabel>
		);
	} else {
		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.61)}
				Image={assetIds.images.ui.index.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.3} />
				<PetMasteryIndexHeader />
				<IndexEggScroll
					world={props.world}
					displayEgg={(eggName: EggName | undefined): void => setEggToView(eggName)}
					currentEgg={eggToView}
				/>
				<IndexEggView
					egg={eggToView}
					displayPets={(variant: Variants): void => setPetViewType(variant)}
					hideInfo={(): void => setEggToView(undefined)}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.075)}
					minimizedSize={0.075}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</imagelabel>
		);
	}
});
