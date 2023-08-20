import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { Notification } from "client/ui/elements/common/notification";
import { hooks } from "client/ui/hooks";
import { getEggImage } from "client/util/getEggImage";
import { getPetMasteryUnclaimedChallenges } from "client/util/getPetMasteryUnclaimedChallenges";
import { playSFX, UIEngagement } from "client/util/playSound";
import { EggName } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getEggData } from "shared/util/getEggData";

interface IndexEggCardProps extends IndexEggCardMappedProps {
	egg: EggName;
	layoutOrder: number;
	currentEgg: EggName | undefined;
	displayEgg: (eggName: EggName | undefined) => void;
}

interface IndexEggCardMappedProps {
	index: PlayerIndexState;
	petMastery: PetMasteryState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): IndexEggCardMappedProps {
	return {
		index: state.index,
		petMastery: state.petMastery,
	};
}

/**
 * A button allowing the player to view information about a specific egg.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const IndexEggCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexEggCardProps, hooks) => {
		let isDiscovered = false;
		const eggData = getEggData(props.egg);
		for (const [, petData] of pairs(eggData.pets)) {
			if (props.index.pets.find((index) => index.id === petData.id) !== undefined) {
				isDiscovered = true;
				break;
			}
		}
		if (eggData.world === "Limited" && !isDiscovered) {
			return <></>;
		}

		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		const unseenChallenges = getPetMasteryUnclaimedChallenges(props.egg);
		return (
			<BaseFrame BackgroundTransparency={1} LayoutOrder={props.layoutOrder}>
				<uiaspectratioconstraint AspectRatio={4.5} />
				<ImageButton
					native={{
						Position: UDim2.fromScale(0.57, 0.525),
						Size: UDim2.fromScale(0.85, 0.95),
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						LayoutOrder: props.layoutOrder,
						Image: "",
					}}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */ Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

							if (props.currentEgg !== undefined && props.currentEgg === props.egg) {
								props.displayEgg(undefined);
								return;
							}

							props.displayEgg(props.egg);
						},
						MouseEnter: (): void => motor.setGoal(raisedSpring),
						MouseLeave: (): void => motor.setGoal(normalSpring),
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<uiaspectratioconstraint AspectRatio={4.5} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.55, 0.5),
							Size: UDim2.fromScale(0.8, 0.9),
							Text: isDiscovered ? props.egg : "???",
						}}
						stroke={{ native: { Thickness: 3 } }}
					/>

					<BaseFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						Position={UDim2.fromScale(0, 0.5)}
						Size={UDim2.fromScale(0.4, 1.2)}
						BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

						<ImageLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.9),
								Position: binding.map((value) => UDim2.fromScale(0.5, value)),
								Image: getEggImage(props.egg),
								ImageColor3: isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0),
							}}
						/>
					</BaseFrame>
					{unseenChallenges > 0 && (
						<Notification
							amount={unseenChallenges}
							position={UDim2.fromScale(1, 0.5)}
							size={UDim2.fromScale(0.45, 0.45)}
						/>
					)}
				</ImageButton>
			</BaseFrame>
		);
	}),
);
