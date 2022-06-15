import Roact from "@rbxts/roact";
import { relayHatch } from "client/network";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { EggNames } from "shared/configs/eggs";
import { ConfirmedPet } from "shared/remotes/eggs/relayHatchInfo";

import { AnimateEggs, HatchEggParams } from "./animateEggs";
import { InfoFrame } from "./infoFrame";

interface EggHatchState {
	eggName: EggNames;
	isActive: boolean;
	isVoid: boolean;
	isVisible: boolean;
	pets: Array<ConfirmedPet>;
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
			const infoFrames: Array<Roact.Element> = [];
			for (const pet of this.state.pets) {
				const id = (infoFrames.size() + 1) as 1 | 2 | 3;
				infoFrames.push(
					<InfoFrame
						eggName={this.state.eggName}
						id={this.state.pets.size() === 1 ? 3 : id}
						isVisible={this.state.isVisible}
						isVoid={this.state.isVoid}
						pet={pet.id}
					/>,
				);
			}

			return (
				<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
					{infoFrames}
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
			isVisible: false,
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
			const confirmedPetsAmount = petIds.size();

			for (let i = 1; i <= confirmedPetsAmount; i++) {}

			this.setState({
				isVisible: true,
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
