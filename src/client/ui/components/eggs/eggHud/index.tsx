import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { EggName, EGGS } from "shared/configs/eggs";

import { AnimateEggs } from "../eggHatch/animateEggs";
import { eggHudAnimator } from "./eggHudAnimator";
import { EggHudDisplay } from "./eggHudDisplay";

interface EggHudProps {
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

/* eslint-disable jsdoc/require-jsdoc */
export const EggHud = hooks((props: EggHudProps, { useState, useEffect }) => {
	const [isActive, setIsActive] = useState(true);

	// setup egg hud animator
	useEffect(() => {
		eggHudAnimator.init();
		return (): void => {
			eggHudAnimator.destroy();
		};
	}, []);

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
		// todo: clear this code up a bit
		eggHudAnimator.clearMotors();
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

				return (
					<frame Visible={false}>
						<EggHudDisplay
							adornee={regularEgg}
							eggName={eggName}
							isVoid={false}
							pets={eggData.pets}
							initiateHatch={props.initiateHatch}
						/>
						<EggHudDisplay
							adornee={voidEgg}
							eggName={eggName}
							isVoid={true}
							pets={eggData.pets}
							initiateHatch={props.initiateHatch}
						/>
					</frame>
				);
			})}
		</frame>
	);
});
