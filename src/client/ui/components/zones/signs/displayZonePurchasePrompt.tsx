import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

interface DisplayZonePurchasePromptProps extends DisplayZonePurchasePromptMappedProps {
	worldName: WorldName;
	zoneName: ZoneNames;
	zoneData: Zone;
	setViewedZone: (world: WorldName, zone: number) => void;
}

interface DisplayZonePurchasePromptMappedProps {
	worlds: WorldsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): DisplayZonePurchasePromptMappedProps {
	return {
		worlds: state.worlds,
	};
}

/**
 * Ineraction UI roact component for displaying a zone's purchase prompt.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const DisplayZonePurchasePrompt = RoactRodux.connect(mapStateToProps)(
	hooks((props: DisplayZonePurchasePromptProps, hooks) => {
		const minimizedSize = 0.21;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.25;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const worldData = props.worlds.find((world) => world.name === props.worldName);
		if (worldData === undefined) {
			warn(
				`Could not find world data for world ${props.worldName} when attempting to display purchase prompt for zone ${props.zoneName}`,
			);
			return <></>;
		}

		const ownsWorld = worldData.zones.find((zone) => zone === props.zoneName);
		if (ownsWorld === undefined) {
			return (
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.85)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.4, value);
					})}
					Image={assetIds.images.buttons["green toggle button"]}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.setViewedZone(props.worldName, props.zoneData.id);
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.7)}
						Text={"Purchase"}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
				</imagebutton>
			);
		} else {
			return (
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.85)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.4, value);
					})}
					Image={assetIds.images.buttons["green toggle button"]}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.7)}
						Text={"Owned"}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
				</imagebutton>
			);
		}
	}),
);

/* eslint-enable jsdoc/require-jsdoc */
