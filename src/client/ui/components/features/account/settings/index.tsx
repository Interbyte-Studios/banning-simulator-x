import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";
import { SettingsState } from "shared/rodux/settings";

import { RightComponentHeader } from "../util/rightComponentHeader";
import { OptionChoice } from "./optionChoice";
import { OptionMultiChoice } from "./optionMultiChoice";
import { OptionSectionHeader } from "./sectionHeader";

interface OptionsProps extends OptionsMappedProps {
	returnToSelection: () => void;
}

interface OptionsMappedProps {
	settings: SettingsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): OptionsMappedProps {
	return {
		settings: state.settings,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const PlayerOptions = RoactRodux.connect(mapStateToProps)(
	hooks((props: OptionsProps, { useContext }) => {
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
			togglePetAnimationType,
			togglePetsStudsOfDistance,
			togglePetsDisplayed,
			toggleAutoDelete,
		} = useContext(remoteContext);

		return (
			<>
				<RightComponentHeader
					storeFound={true}
					headerText={`Settings [${Players.LocalPlayer.Name}]`}
					returnToSelection={props.returnToSelection}
					displayReturn={true}
				/>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.725, 0.615)}
					Size={UDim2.fromScale(0.5, 0.685)}
					ScrollBarThickness={0}
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
						header={"Pet Animation"}
						context={props.settings.visual.petAnimationType === "Following" ? "1" : "2"}
						yPos={0.443}
						onDecrease={(): void => togglePetAnimationType.SendToServer("Following")}
						onIncrease={(): void => togglePetAnimationType.SendToServer("Surrounding")}
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

					<OptionSectionHeader text={"Auto Delete"} yPos={0.543} />
					<OptionChoice
						header={"Basic Rarity"}
						enabled={props.settings.autoDelete.rarities.Basic}
						yPos={0.568}
						onPressed={(): void => toggleAutoDelete.SendToServer("Basic")}
					/>
					<OptionChoice
						header={"Ordinary Rarity"}
						enabled={props.settings.autoDelete.rarities.Ordinary}
						yPos={0.601}
						onPressed={(): void => toggleAutoDelete.SendToServer("Ordinary")}
					/>
					<OptionChoice
						header={"Rare Rarity"}
						enabled={props.settings.autoDelete.rarities.Rare}
						yPos={0.634}
						onPressed={(): void => toggleAutoDelete.SendToServer("Rare")}
					/>
					<OptionChoice
						header={"Epic Rarity"}
						enabled={props.settings.autoDelete.rarities.Epic}
						yPos={0.667}
						onPressed={(): void => toggleAutoDelete.SendToServer("Epic")}
					/>
				</scrollingframe>
			</>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
