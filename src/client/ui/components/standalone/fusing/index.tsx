// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { shouldDisplay } from "client/util/shouldDisplay";
import assetIds from "shared/assets";
import { Variants } from "shared/configs/pets";

import { DisplayPets } from "./displayPets";
import { PetSelection } from "./petSelection";

/* eslint-disable jsdoc/require-jsdoc */
export const Fusing = hooks(
	(
		props: {
			isVisible: boolean;
			setVisibility: (value: boolean) => void;
			variant: Exclude<Variants, "regular"> | undefined;
		},
		hooks,
	) => {
		const { useState, useEffect } = hooks;

		const [petSelected, setPetSelected] = useState<number | undefined>(undefined);
		const [fusingVariant, setFusingVariant] = useState<Exclude<Variants, "regular">>(props.variant ?? "void");

		const screenToDisplay: Array<Roact.Element> = [];
		if (petSelected !== undefined) {
			screenToDisplay.push(
				<DisplayPets
					variant={fusingVariant}
					returnToSelection={(): void => setPetSelected(undefined)}
					petSelected={petSelected}
				/>,
			);
		} else {
			screenToDisplay.push(
				<PetSelection variant={fusingVariant} setPetSelected={(petId: number): void => setPetSelected(petId)} />,
			);
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

		const billboardElement = (adornee: BasePart, variant: Exclude<Variants, "regular">): Roact.Element => {
			return (
				<billboardgui
					Active={true}
					AlwaysOnTop={true}
					LightInfluence={0}
					Size={UDim2.fromScale(12, 10)}
					StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
					MaxDistance={80}
					Adornee={adornee}
				>
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.2),
							Image: assetIds.images.vectors.trading.Upgrade,
						}}
						size={{ minSize: 0.4, maxSize: 0.5 }}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</SpringImageButton>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(1.5, 0.25),
							FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
							Text: `${variant === "radiant" ? "Radiant" : "Void"} Fusing`,
							TextColor3: Color3.fromRGB(255, 255, 255),
						}}
						stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
					>
						<uigradient
							Rotation={90}
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(
										0,
										variant === "radiant" ? Color3.fromRGB(255, 224, 101) : Color3.fromRGB(255, 0, 255),
									),
									new ColorSequenceKeypoint(
										1,
										variant === "radiant" ? Color3.fromRGB(255, 143, 0) : Color3.fromRGB(107, 0, 255),
									),
								])
							}
						/>
					</StrokeTextLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.7),
							Size: UDim2.fromScale(1.1, 0.2),
							FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
							Text: "Fuse stronger pets!",
						}}
						stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.95),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.4, maxSize: 0.5 }}
						events={{
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								setFusingVariant(variant);
								props.setVisibility(true);
							},
						}}
					>
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.8, 0.8),
								Text: "Open (E)",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
						<uiaspectratioconstraint AspectRatio={2} />
					</SpringImageButton>
				</billboardgui>
			);
		};

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
							setPetSelected(undefined);
							props.setVisibility(false);
						}}
					/>
				</ImageLabel>
			);
		} else {
			return (
				<>
					{radiantPrompts.map((promptPart) => billboardElement(promptPart, "radiant"))}
					{voidPrompts.map((promptPart) => billboardElement(promptPart, "void"))}
				</>
			);
		}
	},
);
/* eslint-enable jsdoc/require-jsdoc */
