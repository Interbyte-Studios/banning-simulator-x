import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService } from "@rbxts/services";
import { getIsTrading } from "client/modules/isTradingCache";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";

interface TripleHatchEggProps extends TripleHatchEggMappedProps {
	eggName: EggName;
	isVoid: boolean;
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

interface TripleHatchEggMappedProps {
	autoActive: boolean;
	currenciesState: CurrenciesState;
	gamepassesState: GamepassesState;
	petsState: PetsState;
	worldsState: WorldsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TripleHatchEggMappedProps {
	return {
		autoActive: state.settings.gameplay.autoHatch,
		currenciesState: state.currencies,
		gamepassesState: state.gamepasses,
		petsState: state.pets,
		worldsState: state.worlds,
	};
}

/**
 * Roact imagebutton component to hatch 3 eggs.
 */
export const TripleHatchEggButton = RoactRodux.connect(mapStateToProps)((props: TripleHatchEggProps): Roact.Element => {
	const player = Players.LocalPlayer;

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.65, 0.75),
				Image: assetIds.images.buttons["teal button"],
			}}
			size={{ minSize: 0.1, maxSize: 0.12 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MajorEngagement);

					// eslint-disable-next-line roblox-ts/lua-truthiness
					if (!props.gamepassesState["Triple Hatch"]) {
						MarketplaceService.PromptGamePassPurchase(player, GAMEPASSES["Triple Hatch"]);
						return;
					}

					if (props.autoActive) {
						const character = player.Character;
						if (character === undefined) {
							return;
						}

						const humanoid = character.FindFirstChildOfClass("Humanoid");
						if (humanoid === undefined) {
							return;
						}

						RunService.BindToRenderStep("autoHatch", Enum.RenderPriority.Last.Value, async () => {
							if (getIsTrading()) {
								RunService.UnbindFromRenderStep("autoHatch");
								return;
							}

							const character = player.Character;
							if (character === undefined) {
								RunService.UnbindFromRenderStep("autoHatch");
								return;
							}

							const humanoid = character.FindFirstChildOfClass("Humanoid");
							if (humanoid === undefined) {
								RunService.UnbindFromRenderStep("autoHatch");
								return;
							}

							await props.initiateHatch(3, props.eggName, props.isVoid);
						});

						const movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
							RunService.UnbindFromRenderStep("autoHatch");
							movementConnection.Disconnect();
						});

						const diedConnection = humanoid.Died.Connect(() => {
							RunService.UnbindFromRenderStep("autoHatch");
							diedConnection.Disconnect();
						});
					} else {
						if (getIsTrading()) {
							return;
						}

						await props.initiateHatch(3, props.eggName, props.isVoid);
					}
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(1, 1),
					Text: "T",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(54, 130, 133) }, isBillboard: true }}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.95),
						Size: UDim2.fromScale(1, 0.4),
						Text: "Triple",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(54, 130, 133) }, isBillboard: true }}
				/>
			</StrokeTextLabel>
		</SpringImageButton>
	);
});
