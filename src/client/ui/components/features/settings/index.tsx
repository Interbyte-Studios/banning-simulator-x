import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiHeaderStrokeColor, vec2Middle } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { SettingsState } from "shared/rodux/settings";

import { OptionChoice } from "./optionChoice";
import { OptionMultiChoice } from "./optionMultiChoice";
import { OptionSectionHeader } from "./sectionHeader";

interface SettingsProps extends SettingsMappedProps {
	hideMenu: () => void;
}

interface SettingsMappedProps {
	settings: SettingsState;
}

/**
 * The settings component mapped props.
 *
 * @param state The rodux store state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): SettingsMappedProps => {
	return {
		settings: state.settings,
	};
};

export const Settings = RoactRodux.connect(mapStateToProps)(
	hooks((props: SettingsProps, { useContext }) => {
		const {
			toggleButtonClickSFX,
			toggleMusicVolume,
			toggleSoundEffectsVolume,
			toggleAuto,
			toggleWalkSpeed,
			togglePublicInventory,
			togglePublicTradeHistory,
			tradesEnabled,
			toggleGraphics,
			toggleTimeOfDay,
			togglePetsStudsOfDistance,
			togglePetsDisplayed,
		} = useContext(remoteContext);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.25, 0.5),
					Image: assetIds.images.ui.settings.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={0.878} />
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.49, 0.08),
						Size: UDim2.fromScale(0.4, 0.125),
						Text: "Settings",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.075)}
					minimizedSize={0.1}
					maximizedSize={0.125}
					onClosed={(): void => props.hideMenu()}
				/>

				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.575)}
					Size={UDim2.fromScale(0.925, 0.785)}
					ScrollBarThickness={12}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
					CanvasSize={UDim2.fromScale(0, 4)}
				>
					<OptionSectionHeader text={"Sound / SFX"} yPos={0.01} />
					<OptionChoice
						header={"Button SFX"}
						enabled={props.settings.sound.buttonClick}
						yPos={0.035}
						onPressed={(): void => toggleButtonClickSFX.SendToServer(!props.settings.sound.buttonClick)}
					/>
					<OptionMultiChoice
						header={"Music Volume"}
						context={`${props.settings.sound.music * 10}%`}
						yPos={0.068}
						onDecrease={(): void => {
							const decreasedVolume = props.settings.sound.music - 1;
							if (decreasedVolume < 0) {
								return;
							}

							toggleMusicVolume.SendToServer(decreasedVolume);
						}}
						onIncrease={(): void => {
							const increasedVolume = props.settings.sound.music + 1;
							if (increasedVolume > 10) {
								return;
							}

							toggleMusicVolume.SendToServer(increasedVolume);
						}}
					/>
					<OptionMultiChoice
						header={"SFX Volume"}
						context={`${props.settings.sound.soundEffects * 10}%`}
						yPos={0.101}
						onDecrease={(): void => {
							const decreasedVolume = props.settings.sound.soundEffects - 1;
							if (decreasedVolume < 0) {
								return;
							}

							toggleSoundEffectsVolume.SendToServer(decreasedVolume);
						}}
						onIncrease={(): void => {
							const increaseVolume = props.settings.sound.soundEffects + 1;
							if (increaseVolume > 10) {
								return;
							}

							toggleSoundEffectsVolume.SendToServer(increaseVolume);
						}}
					/>

					<OptionSectionHeader text={"Gameplay"} yPos={0.135} />
					<OptionChoice
						header={"Auto Hatch"}
						enabled={props.settings.gameplay.autoHatch}
						yPos={0.16}
						onPressed={(): void => toggleAuto.SendToServer()}
					/>
					<OptionMultiChoice
						header={"Walkspeed"}
						context={tostring(props.settings.gameplay.walkSpeed)}
						yPos={0.193}
						onDecrease={(): void => toggleWalkSpeed.SendToServer(props.settings.gameplay.walkSpeed - 1)}
						onIncrease={(): void => toggleWalkSpeed.SendToServer(props.settings.gameplay.walkSpeed + 1)}
					/>

					<OptionSectionHeader text={"Privacy"} yPos={0.227} />
					<OptionChoice
						header={"Public Inventory"}
						enabled={props.settings.privacy.publicInventory}
						yPos={0.252}
						onPressed={(): void => togglePublicInventory.SendToServer()}
					/>
					<OptionChoice
						header={"Public Trades"}
						enabled={props.settings.privacy.publicTradeHistory}
						yPos={0.285}
						onPressed={(): void => togglePublicTradeHistory.SendToServer()}
					/>
					<OptionChoice
						header={"Trades Enabled"}
						enabled={props.settings.privacy.tradesEnabled}
						yPos={0.318}
						onPressed={(): void => tradesEnabled.SendToServer()}
					/>

					<OptionSectionHeader text={"Visual"} yPos={0.352} />
					<OptionMultiChoice
						header={"Graphics"}
						context={props.settings.visual.graphicsQuality}
						yPos={0.377}
						onDecrease={(): void => toggleGraphics.SendToServer("Low")}
						onIncrease={(): void => toggleGraphics.SendToServer("High")}
					/>
					<OptionMultiChoice
						header={"Time of Day"}
						context={tostring(props.settings.visual.timeOfDay)}
						yPos={0.41}
						onDecrease={(): void => {
							const decreasedTimeOfday = props.settings.visual.timeOfDay - 1;
							if (decreasedTimeOfday <= 0) {
								return;
							}

							toggleTimeOfDay.SendToServer(decreasedTimeOfday);
						}}
						onIncrease={(): void => {
							const increasedTimeOfDay = props.settings.visual.timeOfDay + 1;
							if (increasedTimeOfDay > 24) {
								return;
							}

							toggleTimeOfDay.SendToServer(increasedTimeOfDay);
						}}
					/>
					<OptionMultiChoice
						header={"Pet Distance"}
						context={tostring(props.settings.visual.petsStudsOfDistance)}
						yPos={0.476}
						onDecrease={(): void => {
							if (props.settings.visual.petsStudsOfDistance <= 10) {
								return;
							}

							togglePetsStudsOfDistance.SendToServer(props.settings.visual.petsStudsOfDistance - 1);
						}}
						onIncrease={(): void => {
							if (props.settings.visual.petsStudsOfDistance >= 20) {
								return;
							}

							togglePetsStudsOfDistance.SendToServer(props.settings.visual.petsStudsOfDistance + 1);
						}}
					/>
					<OptionChoice
						header={"Pets Displayed"}
						enabled={props.settings.visual.petsDisplayed}
						yPos={0.509}
						onPressed={(): void => togglePetsDisplayed.SendToServer(!props.settings.visual.petsDisplayed)}
					/>
				</scrollingframe>
			</ImageLabel>
		);
	}),
);
