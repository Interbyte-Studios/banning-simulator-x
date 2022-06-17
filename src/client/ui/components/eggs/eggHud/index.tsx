import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RunService, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { EGGS } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";

import { AnimateEggs } from "../eggHatch/animateEggs";
import { eggHudAnimator } from "./eggHudAnimator";
import { EggHudDisplay } from "./eggHudDisplay";

interface MappedEggHudProps {
	autoHatch: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): MappedEggHudProps {
	return {
		autoHatch: state.settings.autoHatch,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EggHud = RoactRodux.connect(mapStateToProps)(
	hooks((props: MappedEggHudProps, { useState, useEffect }) => {
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
								autoHatch={props.autoHatch}
								eggName={eggName}
								isVoid={false}
								pets={eggData.pets}
							/>
							<EggHudDisplay
								adornee={voidEgg}
								autoHatch={props.autoHatch}
								eggName={eggName}
								isVoid={true}
								pets={eggData.pets}
							/>
						</frame>
					);
				})}
			</frame>
		);
	}),
);
