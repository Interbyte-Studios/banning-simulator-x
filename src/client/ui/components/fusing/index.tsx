import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Variants } from "shared/configs/pets";
import { ZoneNames } from "shared/configs/zones";

import { shouldDisplay } from "../weaponShop/interactPrompt";
import { DisplayPets } from "./displayPets";
import { PetSelection } from "./petSelection";
import { ZoneSelection } from "./zoneSelection";

/* eslint-disable jsdoc/require-jsdoc */
export const Fusing = hooks((props: { enabled: boolean }, hooks) => {
	const { useState, useEffect } = hooks;

	const [zoneSelected, setZoneSelected] = useState<ZoneNames | undefined>(undefined);
	const [petSelected, setPetSelected] = useState<number | undefined>(undefined);
	const [fusingVariant, setFusingVariant] = useState<Variants>("void");
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const screenToDisplay: Array<Roact.Element> = [];
	if (petSelected !== undefined && zoneSelected !== undefined) {
		screenToDisplay.push(
			<DisplayPets
				variant={fusingVariant}
				returnToSelection={(): void => setPetSelected(undefined)}
				selectedZone={zoneSelected}
				petSelected={petSelected}
			/>,
		);
	} else if (zoneSelected !== undefined) {
		screenToDisplay.push(
			<PetSelection
				variant={fusingVariant}
				returnToSelection={(): void => setZoneSelected(undefined)}
				setPetSelected={(petId: number): void => setPetSelected(petId)}
				selectedZone={zoneSelected}
			/>,
		);
	} else {
		screenToDisplay.push(<ZoneSelection setZone={(zone: ZoneNames): void => setZoneSelected(zone)} />);
	}

	const radiantPrompts: Array<BasePart> = [];
	Workspace.interactions.radiantMachines.interactions.GetChildren().forEach((child) => {
		if (child.IsA("BasePart")) {
			radiantPrompts.push(child);
		}
	});

	const voidPrompts: Array<BasePart> = [];
	Workspace.interactions.voidMachines.interactions.GetChildren().forEach((child) => {
		if (child.IsA("BasePart")) {
			voidPrompts.push(child);
		}
	});

	useEffect(() => {
		ContextActionService.BindAction(
			"openFusion",
			(_, state) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				const character = Players.LocalPlayer.Character;
				if (character === undefined) {
					return;
				}

				for (const prompt of radiantPrompts) {
					const canDisplay = shouldDisplay(character, prompt);
					if (canDisplay) {
						setFusingVariant("radiant");
						setIsVisible(true);
						return;
					}
				}

				for (const prompt of voidPrompts) {
					const canDisplay = shouldDisplay(character, prompt);
					if (canDisplay) {
						setFusingVariant("void");
						setIsVisible(true);
						return;
					}
				}
			},
			false,
			Enum.KeyCode.Z,
		);

		return (): void => {
			ContextActionService.UnbindAction("openFusion");
		};
	});

	if (!props.enabled) {
		return <></>;
	}

	if (isVisible) {
		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.575, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image={assetIds.images.ui.account.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.5} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.4, 0.135)}
					Position={UDim2.fromScale(0.5, 0.08)}
					Text={"Fusing"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) }} />
				</textlabel>

				{screenToDisplay}

				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => {
						setZoneSelected(undefined);
						setPetSelected(undefined);
						setIsVisible(false);
					}}
				/>
			</imagelabel>
		);
	} else {
		return (
			<>
				{radiantPrompts.map((promptPart) => {
					const maximizedSize = 0.7;
					const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

					const minimizedSize = 0.6;
					const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

					const { motor, binding } = useBindingMotor(hooks, maximizedSize);

					return (
						<billboardgui
							Active={true}
							AlwaysOnTop={true}
							LightInfluence={0}
							MaxDistance={25}
							Size={UDim2.fromScale(5, 5)}
							Adornee={promptPart}
						>
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0)}
								Size={UDim2.fromScale(1.5, 0.4)}
								Text={"Radiant Fusion"}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextScaled={true}
								Font={font}
							>
								<BaseUIStroke native={{ Thickness: 2 }} />
							</textlabel>
							<imagebutton
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={binding.map((value) => {
									return UDim2.fromScale(value, value);
								})}
								Image={assetIds.images.buttons["teal button"]}
								ScaleType={Enum.ScaleType.Fit}
								Event={{
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);

										const character = Players.LocalPlayer.Character;
										if (character === undefined) {
											return;
										}

										const isInDistance = shouldDisplay(character, promptPart);
										if (isInDistance) {
											setFusingVariant("radiant");
											setIsVisible(true);
										}
									},
									MouseEnter: (): void => motor.setGoal(minimizedSpring),
									MouseLeave: (): void => motor.setGoal(maximizedSpring),
								}}
							>
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.9, 0.9)}
									Text={"Z"}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextScaled={true}
									Font={font}
								>
									<BaseUIStroke native={{ Thickness: 2 }} />
								</textlabel>
							</imagebutton>
						</billboardgui>
					);
				})}
				{voidPrompts.map((promptPart) => {
					const maximizedSize = 0.7;
					const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

					const minimizedSize = 0.6;
					const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

					const { motor, binding } = useBindingMotor(hooks, maximizedSize);

					return (
						<billboardgui
							Active={true}
							AlwaysOnTop={true}
							LightInfluence={0}
							MaxDistance={25}
							Size={UDim2.fromScale(5, 5)}
							Adornee={promptPart}
						>
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0)}
								Size={UDim2.fromScale(1.5, 0.4)}
								Text={"Void Fusion"}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextScaled={true}
								Font={font}
							>
								<BaseUIStroke native={{ Thickness: 2 }} />
							</textlabel>
							<imagebutton
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={binding.map((value) => {
									return UDim2.fromScale(value, value);
								})}
								Image={assetIds.images.buttons["teal button"]}
								ScaleType={Enum.ScaleType.Fit}
								Event={{
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);

										const character = Players.LocalPlayer.Character;
										if (character === undefined) {
											return;
										}

										const isInDistance = shouldDisplay(character, promptPart);
										if (isInDistance) {
											setFusingVariant("void");
											setIsVisible(true);
										}
									},
									MouseEnter: (): void => motor.setGoal(minimizedSpring),
									MouseLeave: (): void => motor.setGoal(maximizedSpring),
								}}
							>
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.9, 0.9)}
									Text={"Z"}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextScaled={true}
									Font={font}
								>
									<BaseUIStroke native={{ Thickness: 2 }} />
								</textlabel>
							</imagebutton>
						</billboardgui>
					);
				})}
			</>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
