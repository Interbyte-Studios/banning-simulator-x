import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RARITIES } from "shared/configs/rarities";
import { Pet } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";
import { getPetStrength } from "shared/util/getPetStrength";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the pet being viewed in the pet summary.
 */
/* eslint-disable jsdoc/require-jsdoc */
const PetView = hooks((props: { storedPet: Pet }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.185, 0.145)}
			Size={UDim2.fromScale(0.25, 0.425)}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Image={""}
			Event={{
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={binding.map((value) => {
					return UDim2.fromScale(0.5, value);
				})}
				Image={getPetImage(props.storedPet.id, props.storedPet.variant)}
				ScaleType={Enum.ScaleType.Fit}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
			/>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays a summary of the pet being viewed in the item inventory.
 */
export const PetSummary = hooks((props: { storedPet: Pet }, { useEffect, useValue }) => {
	const petData = getPetData(props.storedPet.id);
	const rarityData = RARITIES[petData.rarity];

	const petLevel = math.floor(getPetLevel(props.storedPet));

	const petSummaryRef = useValue(Roact.createRef<ImageLabel>());
	useEffect(() => {
		const petSummary = petSummaryRef.value.getValue();
		assert(petSummary, `Failed to get pet summary ref value.`);

		const petFrame = petSummary.Parent;
		assert(petFrame, `Failed to get pet summary component.`);
		assert(petFrame.IsA("ImageButton"), `Failed to get pet summary component (1).`);

		const scrollingFrame = petFrame.Parent?.Parent;
		assert(scrollingFrame, `Failed to get pet item ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Failed to get pet item ScrollingFrame (1).`);

		const connections: Array<RBXScriptConnection> = [];

		const mouseConnection = UserInputService.InputChanged.Connect((input) => {
			if (input.UserInputType !== Enum.UserInputType.MouseMovement) {
				return;
			}

			let xOffset = math.abs(input.Position.X - petFrame.AbsolutePosition.X);
			let yOffset = math.abs(input.Position.Y - petFrame.AbsolutePosition.Y);

			if (scrollingFrame.AbsolutePosition.X + petSummary.AbsoluteSize.X / 2 >= petFrame.AbsolutePosition.X) {
				xOffset = math.abs(input.Position.X - petFrame.AbsolutePosition.X + petSummary.AbsoluteSize.X / 2);
			}

			if (
				scrollingFrame.AbsolutePosition.X + scrollingFrame.AbsoluteSize.X - petSummary.AbsoluteSize.X <=
				petFrame.AbsolutePosition.X
			) {
				xOffset -= petSummary.AbsoluteSize.X / 2;
			}

			if (scrollingFrame.AbsolutePosition.Y + petSummary.AbsoluteSize.Y / 2 >= petFrame.AbsolutePosition.Y) {
				yOffset = math.abs(input.Position.Y - petFrame.AbsolutePosition.Y + petSummary.AbsoluteSize.Y / 2);
			}

			if (
				scrollingFrame.AbsolutePosition.Y + scrollingFrame.AbsoluteSize.Y - petSummary.AbsoluteSize.Y <=
				petFrame.AbsolutePosition.Y
			) {
				yOffset -= petSummary.AbsoluteSize.Y / 2;
			}

			const offset = new Vector2(xOffset, yOffset);

			petSummary.Position = UDim2.fromOffset(offset.X, offset.Y);
		});
		connections.push(mouseConnection);

		if (UserInputService.TouchEnabled) {
			const touchConnection = UserInputService.TouchPan.Connect((touchPositions) => {});
			connections.push(touchConnection);
		}

		return (): void => connections.forEach((conn) => conn.Disconnect());
	}, []);

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(2.2, 2.2)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.inventory.petSummary}
			ScaleType={Enum.ScaleType.Fit}
			Ref={petSummaryRef.value}
		>
			<uiaspectratioconstraint AspectRatio={0.845} />
			<PetView storedPet={props.storedPet} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.625, 0.125)}
				Position={UDim2.fromScale(0.635, 0.075)}
				Text={petData.name}
				TextScaled={true}
				Font={font}
				TextColor3={
					petData.rarity === "Epic" ||
					petData.rarity === "Legendary" ||
					petData.rarity === "Primordial" ||
					petData.rarity === "Prismatic"
						? rarityData.BeginningColor
						: Color3.fromRGB(255, 255, 255)
				}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.625, 0.1)}
				Position={UDim2.fromScale(0.635, 0.2)}
				Text={petData.rarity}
				TextScaled={true}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.625, 0.1)}
				Position={UDim2.fromScale(0.35, 0.3)}
				Text={`Level: ${petLevel >= 1 ? petLevel : 1}`}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.745, 0.4)}
				Size={UDim2.fromScale(0.35, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(230, 64, 64)}
				Text={twoDpAbbreviator.numberToString(getPetStrength(props.storedPet))}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
			>
				<DamageIcon
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(-0.35, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				/>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.625, 0.1)}
				Position={UDim2.fromScale(0.35, 0.4)}
				Text={`Damage:`}
				TextScaled={true}
				Font={font}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.335, 0.5)}
				Size={UDim2.fromScale(0.6, 0.075)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={
					props.storedPet.variant !== "radiant" ? `${tostring(petData.chance)}% Hatch Chance` : `Cannot be hatched.`
				}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.75 }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.7)}
				Size={UDim2.fromScale(0.675, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(230, 64, 64)}
				Text={"Enhancement"}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(105, 0, 0) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(0.675, 0.075)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(252, 252, 252)}
				Text={"Coming Soon"}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
			</textlabel>
		</imagelabel>
	);
});
