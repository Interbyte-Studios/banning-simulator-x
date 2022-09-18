import Roact from "@rbxts/roact";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { EggName } from "shared/configs/eggs";
import { ConfirmedPet } from "shared/rodux/pets";

import { hooks } from "../../hooks";
import { EggCost } from "./eggCosts";
import { EggHatch } from "./eggHatch";
import { AnimateEggs } from "./eggHatch/animateEggs";
import { EggHud } from "./eggHud";

interface EggsUIProps {
	setHatchingStatus: (isHatching: boolean) => void;
}

interface HatchData {
	eggName: EggName;
	pets: Array<ConfirmedPet>;
	isVoid: boolean;
}

/**
 * A higher ordered component that displays both information for all the eggs in the game and functionality to hatch those eggs.
 */
export const EggsUI = hooks((props: EggsUIProps, { useState, useContext }) => {
	const [currentHatchData, setCurrentHatchData] = useState<HatchData | undefined>(undefined);

	const { hatchEgg } = useContext(remoteContext);

	const children = [
		<EggCost />,
		<EggHud
			initiateHatch={async (amount: 1 | 2 | 3, egg: EggName, isVoid: boolean): Promise<void> => {
				const requestEggHatch = await hatchEgg.CallServerAsync(amount, egg, isVoid);

				if (requestEggHatch.success) {
					props.setHatchingStatus(true);
					AnimateEggs.handleAnimation();
					AnimateEggs.initiateEggHatch({
						amount,
						eggName: egg,
						isVoid,
					});

					setCurrentHatchData({
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
					});

					AnimateEggs.initiatePetHatch({
						amount,
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
					});

					setCurrentHatchData(undefined);
					props.setHatchingStatus(false);
				} else {
					setCurrentHatchData(undefined);
				}
			}}
		/>,
	];

	if (currentHatchData) {
		children.push(
			<EggHatch eggName={currentHatchData.eggName} isVoid={currentHatchData.isVoid} pets={currentHatchData.pets} />,
		);
	}

	return (
		<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
			{children}
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
