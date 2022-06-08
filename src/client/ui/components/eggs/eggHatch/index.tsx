import Roact from "@rbxts/roact";
import { relayHatch } from "client/network";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { EggNames } from "shared/configs/eggs";

import { AnimateEggs, HatchEggParams } from "./animateEggs";
import { InfoFrame } from "./infoFrame";

interface EggHatchState {
	eggName: EggNames;
	isActive: boolean;
	isVoid: boolean;
	isVisible: {
		1: boolean;
		2: boolean;
		3: boolean;
	};
	pets: Array<number>;
}

/* eslint-disable jsdoc/require-jsdoc */
export class EggHatch extends Roact.Component<{}, EggHatchState> {
	/**
	 * Required render function for a Roact component.
	 *
	 * @returns A info hud roact element.
	 */
	public render(): Roact.Element {
		if (this.state.isActive) {
			if (this.state.eggName === undefined) {
				return <></>;
			}
			if (this.state.pets === undefined) {
				return <></>;
			}

			return (
				<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
					<InfoFrame
						eggName={this.state.eggName}
						id={0}
						isVisible={this.state.isVisible[1]}
						isVoid={this.state.isVoid}
						pet={this.state.pets[0]}
					/>
					<InfoFrame
						eggName={this.state.eggName}
						id={1}
						isVisible={this.state.isVisible[2]}
						isVoid={this.state.isVoid}
						pet={this.state.pets[1]}
					/>
					<InfoFrame
						eggName={this.state.eggName}
						id={2}
						isVisible={this.state.isVisible[3]}
						isVoid={this.state.isVoid}
						pet={this.state.pets[2]}
					/>
				</frame>
			);
		} else {
			return <></>;
		}
	}

	/**
	 * Function that runs when the info hud Roact component mounts.
	 */
	protected didMount(): void {
		this.setState({
			isActive: false,
			isVisible: {
				1: false,
				2: false,
				3: false,
			},
		});

		relayHatch.Connect((amount, eggName, petIds, isVoid) => {
			if (
				!AnimateEggs.eggAnimationComplete ||
				!AnimateEggs.petAnimationComplete ||
				AnimateEggs.eggAnimationInitiated ||
				AnimateEggs.petAnimationInitiated
			)
				return;

			AnimateEggs.handleAnimation();

			this.setState({
				eggName: eggName,
				isActive: true,
				isVoid: isVoid,
				pets: petIds,
			});

			const animatedEggsParams: HatchEggParams = {
				amount: amount,
				eggName: eggName,
				isVoid: isVoid,
			};
			AnimateEggs.hatchEggs(animatedEggsParams);

			this.setState({
				isVisible: {
					1: amount === 1 || amount === 3,
					2: amount === 2 || amount === 3,
					3: amount === 2 || amount === 3,
				},
			});

			const animatedPetsParams: HatchEggParams = {
				amount: amount,
				eggName: eggName,
				isVoid: isVoid,
				pets: petIds,
			};
			AnimateEggs.hatchPets(animatedPetsParams);

			this.setState({
				isActive: false,
				isVisible: {
					1: false,
					2: false,
					3: false,
				},
			});
		});
	}
}
