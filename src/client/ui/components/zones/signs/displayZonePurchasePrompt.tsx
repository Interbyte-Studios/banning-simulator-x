// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { BaseImageButton } from "client/ui/elements/baseElements/baseImageButton";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
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
	hooks((props: DisplayZonePurchasePromptProps) => {
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
				<BaseImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.85),
						Image: assetIds.images.buttons["green toggle button"],
					}}
					size={{ minSize: 0.21, maxSize: 0.25 }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.setViewedZone(props.worldName, props.zoneData.id);
						},
					}}
				>
					<BaseTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.7),
							Text: "Purchase",
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 2 } }}
					/>
				</BaseImageButton>
			);
		} else {
			return (
				<BaseImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.85),
						Image: assetIds.images.buttons["green toggle button"],
					}}
					size={{ minSize: 0.21, maxSize: 0.25 }}
				>
					<BaseTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.7),
							Text: "Owned",
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 2 },
						}}
					/>
				</BaseImageButton>
			);
		}
	}),
);

/* eslint-enable jsdoc/require-jsdoc */
