import Roact from "@rbxts/roact";
import { relayHatch } from "client/network";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { EggNames } from "shared/configs/eggs";

import { AnimateEggs } from "./animateEggs";
import { InfoFrame } from "./infoFrame";

interface EggHatchState {
	eggName: EggNames | undefined;
	isActive: boolean;
	pets: Array<number> | undefined;
}

/* eslint-disable jsdoc/require-jsdoc */
export class EggHatch extends Roact.Component<{}, EggHatchState> {
	public render(): Roact.Element | undefined {
		const [infoFramesVisible, updateInfoFramesVisibility] = Roact.createBinding({
			0: false,
			1: false,
			2: false,
		});

		if (this.state.isActive) {
			return (
				<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
					<InfoFrame Id={0} IsVisible={infoFramesVisible.getValue()[0]} />
					<InfoFrame Id={1} IsVisible={infoFramesVisible.getValue()[1]} />
					<InfoFrame Id={2} IsVisible={infoFramesVisible.getValue()[2]} />
				</frame>
			);
		} else {
			return <></>;
		}
	}

	protected didMount(): void {
		this.setState({
			eggName: undefined,
			isActive: false,
			pets: undefined,
		});

		relayHatch.Connect((eggName, petIds, isVoid) => {
			AnimateEggs.hatchEggs(3, eggName, petIds, isVoid);

			this.setState({
				eggName: eggName,
				isActive: true,
				pets: petIds,
			});
		});
	}
}
