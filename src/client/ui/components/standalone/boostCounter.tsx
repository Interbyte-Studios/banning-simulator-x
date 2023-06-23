import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { formatTime } from "client/util/formatTime";
import { BOOST_IMAGES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { BoostsState } from "shared/rodux/boosts";

interface BoostCounterMappedProps {
	boosts: BoostsState;
}

/**
 * Maps the rodux store state to the boost counter component.
 *
 * @param state - The rodux store state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): BoostCounterMappedProps => {
	return {
		boosts: state.boosts,
	};
};

/**
 * Active boost counter component.
 */
export const BoostCounter = RoactRodux.connect(mapStateToProps)((props: BoostCounterMappedProps) => {
	return (
		<BaseFrame Position={UDim2.fromScale(0.115, 0.925)} Size={UDim2.fromScale(0.2, 0.125)}>
			<uigridlayout
				CellPadding={UDim2.fromScale(0.05, 0.2)}
				CellSize={UDim2.fromScale(0.19, 0.5)}
				StartCorner={Enum.StartCorner.BottomLeft}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
			/>
			{Object.entries(props.boosts.active).map(([boostName, boostTime]) => {
				if (boostTime < 1) {
					return <></>;
				}

				let boostImage = BOOST_IMAGES[boostName][15];
				if (boostTime > 60 * 60 * 120) {
					boostImage = BOOST_IMAGES[boostName][120];
				} else if (boostTime > 60 * 60 * 60) {
					boostImage = BOOST_IMAGES[boostName][60];
				} else if (boostTime > 60 * 60 * 30) {
					boostImage = BOOST_IMAGES[boostName][30];
				} else if (boostTime > 60 * 60 * 15) {
					boostImage = BOOST_IMAGES[boostName][15];
				}

				return (
					<ImageLabel
						native={{
							Image: boostImage,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<StrokeTextLabel
							native={{
								Text: formatTime(boostTime),
								Position: UDim2.fromScale(0.5, 0),
								Size: UDim2.fromScale(1.2, 0.4),
							}}
							stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
						/>
					</ImageLabel>
				);
			})}
		</BaseFrame>
	);
});
