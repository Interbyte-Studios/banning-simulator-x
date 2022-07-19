/* eslint-disable jsdoc/require-description-complete-sentence */

import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setMusicVolume } from "client/settings/musicVolume";
import { setsPetsStudsOfDistance } from "client/settings/petStudsOfDistance";
import { setSoundEffects } from "client/settings/soundEffects";
import { setTimeOfDay } from "client/settings/timeOfDay";
import { setWalkSpeed } from "client/settings/walkSpeed";
import { font, udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

import { ModifySettingOption } from "./modifySettingOption";
import { ToggleSettingOption } from "./toggleSettingOption";

interface SettingsMenuProps extends SettingsMenuMappedProps {
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
 * **<< Roact Component >>**
 *
 * A menu user interface that displays various methods of game configurations editable by the player.
 *
 * @param props Properties of the settings menu component.
 * @param props.hideMenu A function used to hide the settings menu ui.
 */
export const SettingsMenu = RoactRodux.connect(mapStateToProps)(
	hooks((props: SettingsMenuProps, { useContext }) => {
		const {
			toggleAuto,
			toggleWalkSpeed,
			toggleButtonClickSFX,
			toggleMusicVolume,
			toggleSoundEffectsVolume,
			toggleGraphics,
			togglePetAnimationType,
			togglePetsDisplayed,
			togglePetsStudsOfDistance,
			toggleTimeOfDay,
		} = useContext(remoteContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				Size={udim2BottomRight}
				Position={udim2Middle}
				BackgroundTransparency={1}
				Image={assetIds.images.backgrounds.dark.Settings}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.02)}
					Size={UDim2.fromScale(0.75, 0.35)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Settings"}
					Font={font}
				>
					<BaseUIStroke Thickness={4} />
				</textlabel>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(0.9, 0.8)}
					Position={udim2Middle}
					ScrollBarThickness={6}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.04)}
						Size={UDim2.fromScale(0.4, 0.04)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Sound"}
						Font={font}
					>
						<BaseUIStroke Thickness={2} />
					</textlabel>
					<ToggleSettingOption
						position={UDim2.fromScale(0.5, 0.09)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Button Click SFX"}
						isEnabled={props.settings.sound.buttonClick}
						onClicked={(): void => toggleButtonClickSFX.SendToServer(!props.settings.sound.buttonClick)}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.145)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Music Volume"}
						settingState={props.settings.sound.music}
						displayPercentage={true}
						onIncrease={(): void => setMusicVolume(props.settings.sound.music + 1, toggleMusicVolume)}
						onDecrease={(): void => setMusicVolume(props.settings.sound.music - 1, toggleMusicVolume)}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.2)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"SFX Volume"}
						settingState={props.settings.sound.soundEffects}
						displayPercentage={true}
						onIncrease={(): void => setSoundEffects(props.settings.sound.soundEffects + 1, toggleSoundEffectsVolume)}
						onDecrease={(): void => setSoundEffects(props.settings.sound.soundEffects - 1, toggleSoundEffectsVolume)}
					/>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.265)}
						Size={UDim2.fromScale(0.4, 0.04)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Gameplay"}
						Font={font}
					>
						<BaseUIStroke Thickness={2} />
					</textlabel>
					<ToggleSettingOption
						position={UDim2.fromScale(0.5, 0.31)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Auto Hatch"}
						isEnabled={props.settings.gameplay.autoHatch}
						onClicked={(): void => toggleAuto.SendToServer()}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.365)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Walk Speed"}
						settingState={props.settings.gameplay.walkSpeed}
						displayPercentage={false}
						onIncrease={(): void => setWalkSpeed(props.settings.gameplay.walkSpeed + 1, toggleWalkSpeed)}
						onDecrease={(): void => setWalkSpeed(props.settings.gameplay.walkSpeed + 1, toggleWalkSpeed)}
					/>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.43)}
						Size={UDim2.fromScale(0.4, 0.04)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Visual"}
						Font={font}
					>
						<BaseUIStroke Thickness={2} />
					</textlabel>
					<ToggleSettingOption
						position={UDim2.fromScale(0.5, 0.485)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Low Graphics"}
						isEnabled={props.settings.visual.graphicsQuality === "Low"}
						onClicked={(): void =>
							toggleGraphics.SendToServer(props.settings.visual.graphicsQuality === "High" ? "Low" : "High")
						}
					/>
					<ToggleSettingOption
						position={UDim2.fromScale(0.5, 0.54)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Pets Hidden"}
						isEnabled={!props.settings.visual.petsDisplayed}
						onClicked={(): void => togglePetsDisplayed.SendToServer(!props.settings.visual.petsDisplayed)}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.595)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Pet Animation"}
						settingState={props.settings.visual.petAnimationType}
						displayPercentage={false}
						onIncrease={(): void =>
							togglePetAnimationType.SendToServer(
								props.settings.visual.petAnimationType === "Following" ? "Surrounding" : "Following",
							)
						}
						onDecrease={(): void =>
							togglePetAnimationType.SendToServer(
								props.settings.visual.petAnimationType === "Surrounding" ? "Following" : "Surrounding",
							)
						}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.65)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Pet Distance"}
						settingState={props.settings.visual.petsStudsOfDistance}
						displayPercentage={false}
						onIncrease={(): void =>
							setsPetsStudsOfDistance(props.settings.visual.petsStudsOfDistance + 1, togglePetsStudsOfDistance)
						}
						onDecrease={(): void =>
							setsPetsStudsOfDistance(props.settings.visual.petsStudsOfDistance - 1, togglePetsStudsOfDistance)
						}
					/>
					<ModifySettingOption
						position={UDim2.fromScale(0.5, 0.705)}
						size={UDim2.fromScale(0.98, 0.045)}
						settingName={"Time of Day"}
						settingState={props.settings.visual.timeOfDay}
						displayPercentage={false}
						onIncrease={(): void => setTimeOfDay(props.settings.visual.timeOfDay + 1, toggleTimeOfDay)}
						onDecrease={(): void => setTimeOfDay(props.settings.visual.timeOfDay - 1, toggleTimeOfDay)}
					/>
				</scrollingframe>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.065)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => props.hideMenu()}
				/>
			</imagebutton>
		);
	}),
);
