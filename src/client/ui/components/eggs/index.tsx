import Roact from "@rbxts/roact";
import { remoteContext } from "client/ui/remoteContext";
import { EggName } from "shared/configs/eggs";
import { ConfirmedPet } from "shared/remotes/eggs/hatchEgg";

import { hooks } from "../../hooks";
import { EggCost } from "./eggCosts";
import { EggHatch } from "./eggHatch";
import { AnimateEggs } from "./eggHatch/animateEggs";
import { EggHud } from "./eggHud";

interface HatchData {
	eggName: EggName;
	pets: Array<ConfirmedPet>;
	isVoid: boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export const EggsUI = hooks((_, { useState, useContext }) => {
	const [currentHatchData, setCurrentHatchData] = useState<HatchData | undefined>(undefined);

	const { hatchEgg } = useContext(remoteContext);

	const children = [
		<EggCost />,
		<EggHud
			initiateHatch={async (amount: 1 | 2 | 3, egg: EggName, isVoid: boolean): Promise<void> => {
				const requestEggHatch = await hatchEgg.CallServerAsync(amount, egg, isVoid);

				if (requestEggHatch.success) {
					setCurrentHatchData({
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
					});

					AnimateEggs.handleAnimation();
					AnimateEggs.initiateAnimation({
						amount,
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
					});
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

	return <frame BackgroundTransparency={1}>{children}</frame>;
});
/* eslint-enable jsdoc/require-jsdoc */
