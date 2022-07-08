import Roact from "@rbxts/roact";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { remoteContext } from "client/ui/mocks/remoteContext";
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
				warn("initiating hatch");
				const requestEggHatch = await hatchEgg.CallServerAsync(amount, egg, isVoid);
				warn(requestEggHatch);

				if (requestEggHatch.success) {
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
					warn("success");
				} else {
					setCurrentHatchData(undefined);
					warn("not successful");
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
