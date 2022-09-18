import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

import { SectionHeader } from "./elements/sectionHeader";
import { AutoHatchSetting } from "./interactions/gameplay/autoHatch";
import { WalkSpeedSetting } from "./interactions/gameplay/walkSpeed";
import { ToggleButtonSFXSetting } from "./interactions/sound/buttonSFX";
import { GeneralSFXSetting } from "./interactions/sound/generalSFX";
import { ToggleMusicFXSetting } from "./interactions/sound/musicFX";
import { GraphicsSetting } from "./interactions/visual/graphics";
import { PetAnimationSetting } from "./interactions/visual/petAnimation";
import { PetDistanceSetting } from "./interactions/visual/petDistance";
import { PetsDisplayedSetting } from "./interactions/visual/petsDisplayed";
import { TimeOfDaySetting } from "./interactions/visual/timeOfDay";

interface SettingsMenuProps extends SettingsMenuMappedProps {
	visible: boolean;
	hideMenu: () => void;
}

interface SettingsMenuMappedProps {
	settings: Settings;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): SettingsMenuMappedProps {
	return {
		settings: state.settings,
	};
}

/**
 * A menu user interface that displays various methods of game configurations editable by the player.
 *
 * @param props Properties of the settings menu component.
 * @param props.hideMenu A function used to hide the settings menu ui.
 */
export const SettingsMenu = RoactRodux.connect(mapStateToProps)(
	hooks((props: SettingsMenuProps) => {
		if (!props.visible) {
			return <></>;
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.3, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				Image={assetIds.images.ui.settings.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<SectionHeader position={UDim2.fromScale(0.495, 0.115)} size={UDim2.fromScale(0.4, 0.125)} text={"Settings"} />
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(0.95, 0.735)}
					Position={UDim2.fromScale(0.5, 0.56)}
					ScrollBarThickness={6}
				>
					<SectionHeader position={UDim2.fromScale(0.5, 0.04)} size={UDim2.fromScale(0.4, 0.04)} text={"Sound"} />
					<ToggleButtonSFXSetting />
					<ToggleMusicFXSetting />
					<GeneralSFXSetting />
					<SectionHeader position={UDim2.fromScale(0.5, 0.265)} size={UDim2.fromScale(0.4, 0.04)} text={"Gameplay"} />
					<AutoHatchSetting />
					<WalkSpeedSetting />
					<SectionHeader position={UDim2.fromScale(0.5, 0.43)} size={UDim2.fromScale(0.4, 0.04)} text={"Visual"} />
					<GraphicsSetting />
					<PetsDisplayedSetting />
					<PetAnimationSetting />
					<PetDistanceSetting />
					<TimeOfDaySetting />
				</scrollingframe>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.125)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => props.hideMenu()}
				/>
			</imagelabel>
		);
	}),
);
