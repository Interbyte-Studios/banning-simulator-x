import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { EGGS } from "shared/configs/eggs";
import { Store } from "shared/rodux";

import { AnimateEggs } from "../eggHatch/animateEggs";
import { eggHudAnimatorService } from "./eggHudAnimator";
import { EggHudDisplay } from "./eggHudDisplay";

interface EggHudProps {
	store: Store;
}

interface EggHudState {
	isActive: boolean;
	autoHatch: boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export class EggHud extends Roact.Component<EggHudProps, EggHudState> {
	/**
	 * Required render function for a Roact component.
	 *
	 * @returns A info hud roact element.
	 */
	public render(): Roact.Element {
		if (this.state.isActive) {
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
									autoHatch={this.state.autoHatch}
									eggName={eggName}
									isVoid={false}
									pets={eggData.pets}
									store={this.props.store}
								/>
								<EggHudDisplay
									adornee={voidEgg}
									autoHatch={this.state.autoHatch}
									eggName={eggName}
									isVoid={true}
									pets={eggData.pets}
									store={this.props.store}
								/>
							</frame>
						);
					})}
				</frame>
			);
		} else {
			eggHudAnimatorService.motorSets.clear();
			return <></>;
		}
	}

	/**
	 * Function that runs when the info hud Roact component mounts.
	 */
	protected didMount(): void {
		eggHudAnimatorService.init();

		this.setState({
			isActive: true,
			autoHatch: this.props.store.getState().settings.autoHatch,
		});

		this.props.store.changed.connect((newState, oldState) => {
			if (newState.settings.autoHatch === oldState.settings.autoHatch) return;

			this.setState({
				autoHatch: newState.settings.autoHatch,
			});
		});

		RunService.Heartbeat.Connect(() => {
			if (
				!AnimateEggs.eggAnimationComplete ||
				!AnimateEggs.petAnimationComplete ||
				AnimateEggs.eggAnimationInitiated ||
				AnimateEggs.petAnimationInitiated
			) {
				if (this.state.isActive !== false) {
					this.setState({
						isActive: false,
					});
				}
			} else {
				if (this.state.isActive === false) {
					this.setState({
						isActive: true,
					});
				}
			}
		});
	}
}
