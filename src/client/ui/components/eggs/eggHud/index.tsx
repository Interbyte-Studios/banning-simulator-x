import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { EggName, EGGS } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

import { AnimateEggs } from "../eggHatch/animateEggs";
import { EggHudDisplay } from "./eggHudDisplay";

interface EggHudProps {
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
	displayAutoHatchMenu: () => void;
}

/**
 * Displays informational and interactable ui components for all eggs in the game.
 *
 * @param props Properties of the component.
 * @param props.initiateHatch A function that allows the player to hatch eggs.
 * @returns A roact element.
 */
export const EggHud = hooks((props: EggHudProps, { useState, useEffect }) => {
	const [isActive, setIsActive] = useState(true);

	// handle hiding the hud when animating
	useEffect(() => {
		const connection = RunService.Heartbeat.Connect(() => {
			if (
				!AnimateEggs.eggAnimationComplete ||
				!AnimateEggs.petAnimationComplete ||
				AnimateEggs.eggAnimationInitiated ||
				AnimateEggs.petAnimationInitiated
			) {
				if (isActive !== false) {
					setIsActive(false);
				}
			} else {
				if (isActive === false) {
					setIsActive(true);
				}
			}
		});

		return (): void => {
			connection.Disconnect();
		};
	});

	if (!isActive) {
		return <></>;
	}

	return (
		<frame Visible={false}>
			{Object.entries(EGGS).map(([eggName, eggData]) => {
				const eggFolder = Workspace.interactions.eggs[eggName];

				const regularEgg = eggFolder.regular.egg.PrimaryPart;
				assert(regularEgg, `Expected PrimaryPart for regular ${eggName} egg`);

				const voidEgg = eggFolder.void.egg.PrimaryPart;
				assert(voidEgg, `Expected PrimaryPart for void ${eggName} egg`);

				const pets: Array<Pet> = [];
				for (const [, petData] of pairs(eggData.pets)) {
					pets.push(petData);
				}

				return (
					<frame Visible={false}>
						<EggHudDisplay
							adornee={regularEgg}
							eggName={eggName}
							isVoid={false}
							pets={pets}
							initiateHatch={props.initiateHatch}
							displayAutoDeleteMenu={props.displayAutoHatchMenu}
						/>
						<EggHudDisplay
							adornee={voidEgg}
							eggName={eggName}
							isVoid={true}
							pets={pets}
							initiateHatch={props.initiateHatch}
							displayAutoDeleteMenu={props.displayAutoHatchMenu}
						/>
					</frame>
				);
			})}
		</frame>
	);
});
