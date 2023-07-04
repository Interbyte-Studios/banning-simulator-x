// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { shouldDisplay } from "client/util/shouldDisplay";
import assetIds from "shared/assets";
import { Variants } from "shared/configs/pets";
import { ZoneNames } from "shared/configs/zones";

import { DisplayPets } from "./displayPets";
import { PetSelection } from "./petSelection";
import { ZoneSelection } from "./zoneSelection";

/* eslint-disable jsdoc/require-jsdoc */
export const Fusing = hooks((props: { isVisible: boolean; setVisibility: (value: boolean) => void }, hooks) => {
	const { useState, useEffect } = hooks;

	const [zoneSelected, setZoneSelected] = useState<ZoneNames | "Exclusive" | undefined>(undefined);
	const [petSelected, setPetSelected] = useState<number | undefined>(undefined);
	const [fusingVariant, setFusingVariant] = useState<Exclude<Variants, "regular">>("void");

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
		screenToDisplay.push(<ZoneSelection setZone={(zone: ZoneNames | "Exclusive"): void => setZoneSelected(zone)} />);
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
						props.setVisibility(true);
						return;
					}
				}

				for (const prompt of voidPrompts) {
					const canDisplay = shouldDisplay(character, prompt);
					if (canDisplay) {
						props.setVisibility(true);
						return;
					}
				}
			},
			false,
			Enum.KeyCode.V,
		);

		return (): void => {
			ContextActionService.UnbindAction("openFusion");
		};
	});

	useEffect(() => {
		if (props.isVisible) {
			const character = Players.LocalPlayer.Character;
			if (character === undefined) {
				return;
			}

			for (const prompt of voidPrompts) {
				const canDisplay = shouldDisplay(character, prompt);
				if (canDisplay) {
					setFusingVariant("void");
					return;
				}
			}

			for (const prompt of radiantPrompts) {
				const canDisplay = shouldDisplay(character, prompt);
				if (canDisplay) {
					setFusingVariant("radiant");
					return;
				}
			}
		}
	}, [props.isVisible]);

	if (props.isVisible) {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.575, 0.5),
					Image: assetIds.images.ui.account.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.5} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.4, 0.135),
						Position: UDim2.fromScale(0.5, 0.08),
						Text: `${fusingVariant === "radiant" ? "Radiant" : fusingVariant === "void" ? "Void" : ""} Fusing`,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) },
					}}
				/>

				{screenToDisplay}

				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => {
						setZoneSelected(undefined);
						setPetSelected(undefined);
						props.setVisibility(false);
					}}
				/>
			</ImageLabel>
		);
	} else {
		return (
			<>
				{radiantPrompts.map((promptPart) => {
					const maximizedSize = 0.7;
					const minimizedSize = 0.6;

					return (
						<billboardgui
							Active={true}
							AlwaysOnTop={true}
							LightInfluence={0}
							MaxDistance={25}
							Size={UDim2.fromScale(5, 5)}
							Adornee={promptPart}
						>
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.5, 0),
									Size: UDim2.fromScale(1.5, 0.4),
									Text: "Radiant Fusion",
								}}
								stroke={{
									native: { Thickness: 2 },
								}}
							/>
							<SpringImageButton
								native={{
									Image: assetIds.images.buttons["teal button"],
								}}
								size={{ maxSize: maximizedSize, minSize: minimizedSize }}
								events={{
									Activated: async (): Promise<void> => {
										playSFX(UIEngagement.MinorEngagement);

										const character = Players.LocalPlayer.Character;
										if (character === undefined) {
											return;
										}

										const isInDistance = shouldDisplay(character, promptPart);
										if (isInDistance) {
											setFusingVariant("radiant");
											props.setVisibility(true);
										}
									},
								}}
							>
								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.9, 0.9),
										Text: "V",
									}}
									stroke={{
										native: { Thickness: 2 },
									}}
								/>
							</SpringImageButton>
						</billboardgui>
					);
				})}
				{voidPrompts.map((promptPart) => {
					const maximizedSize = 0.7;
					const minimizedSize = 0.6;

					return (
						<billboardgui
							Active={true}
							AlwaysOnTop={true}
							LightInfluence={0}
							MaxDistance={25}
							Size={UDim2.fromScale(5, 5)}
							Adornee={promptPart}
						>
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.5, 0),
									Size: UDim2.fromScale(1.5, 0.4),
									Text: "Void Fusion",
								}}
								stroke={{
									native: { Thickness: 2 },
								}}
							/>
							<SpringImageButton
								native={{
									Image: assetIds.images.buttons["teal button"],
								}}
								size={{
									maxSize: maximizedSize,
									minSize: minimizedSize,
								}}
								events={{
									Activated: async (): Promise<void> => {
										playSFX(UIEngagement.MinorEngagement);

										const character = Players.LocalPlayer.Character;
										if (character === undefined) {
											return;
										}

										const isInDistance = shouldDisplay(character, promptPart);
										if (isInDistance) {
											setFusingVariant("void");
											props.setVisibility(true);
										}
									},
								}}
							>
								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.9, 0.9),
										Text: "V",
									}}
									stroke={{
										native: { Thickness: 2 },
									}}
								/>
							</SpringImageButton>
						</billboardgui>
					);
				})}
			</>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
