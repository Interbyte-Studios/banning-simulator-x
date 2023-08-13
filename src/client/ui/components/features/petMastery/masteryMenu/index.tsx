// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { WorldName } from "shared/configs/worlds";

import { PetMasteryChallenges } from "./challenges/challengesDisplay";
import { ChallengesPetHeader } from "./challenges/petHeader";
import { PetView } from "./challenges/petView";
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
export const PetMasteryMenu = hooks((props: PetMasteryMenuProps, { useState, useContext }) => {
	const [eggToView, setEggToView] = useState<EggName | undefined>(undefined); // default: undefined
	const [petToView, setPetToView] = useState<number | undefined>(undefined); // default: undefined
	const [petViewType, setPetViewType] = useState<Variants | undefined>(undefined); // default: undefined
	const [viewingChallenges, setViewingChallenges] = useState(false); // default: false

	const { claimPetMastery } = useContext(remoteContext);

	if (viewingChallenges) {
		assert(petToView, `Expected PetMasteryMenu "petToView" stateful value to be defined.`);
		assert(petViewType, `Expected PetMasteryMenu "petViewType" stateful value to be defined.`);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.61),
					Image: assetIds.images.ui.index.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.3} />

				<PetMasteryIndexHeader />
				<ReturnToEggScroll returnToSelection={(): void => setViewingChallenges(false)} />
				<ChallengesPetHeader pet={petToView} variant={petViewType} />
				<PetView pet={petToView} currentVariant={petViewType} activated={(): void => setViewingChallenges(false)} />
				<PetMasteryChallenges pet={petToView} variant={petViewType} />

				{/* <TogglePetMasteryCosmetic pet={petToView} variant={petViewType} /> */}

				<ExitButton
					Position={UDim2.fromScale(0.975, 0.075)}
					minimizedSize={0.075}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	} else if (petViewType !== undefined) {
		assert(eggToView, `Expected PetMasteryMenu "eggToView" stateful value to be defined.`);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.61),
					Image: assetIds.images.ui.index.background,
				}}
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
			</ImageLabel>
		);
	} else {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.61),
					Image: assetIds.images.ui.index.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.3} />

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.08, 0.075),
						Image: "",
						BackgroundColor3: Color3.fromRGB(3, 255, 108),
						BackgroundTransparency: 0,
					}}
					size={{ minSize: 0.225, maxSize: 0.25 }}
					events={{
						/**
						 *
						 */
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MajorEngagement);
							await claimPetMastery.CallServerAsync();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={4} />
					<uicorner CornerRadius={new UDim(0.3, 0)} />
					<BaseUIStroke
						native={{
							Thickness: 3,
							Color: Color3.fromRGB(2, 193, 82),
						}}
					/>
					<BaseFrame
						BackgroundColor3={Color3.fromRGB(2, 193, 82)}
						BackgroundTransparency={0}
						Size={UDim2.fromScale(0.925, 0.775)}
					>
						<uicorner CornerRadius={new UDim(0.3, 0)} />
						<StrokeTextLabel
							native={{
								Text: "Claim All",
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
							}}
							stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(2, 147, 62) } }}
						/>
					</BaseFrame>
				</SpringImageButton>

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
			</ImageLabel>
		);
	}
});
