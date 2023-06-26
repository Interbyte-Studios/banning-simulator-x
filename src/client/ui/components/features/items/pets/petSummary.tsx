import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { ReplicatedStorage, UserInputService } from "@rbxts/services";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { DamageIcon } from "client/ui/elements/icons/damageIcon";
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
const PetView = hooks((props: { storedPet: Pet }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<ImageButton
			native={{
				BackgroundTransparency: 0,
				Position: UDim2.fromScale(0.185, 0.145),
				Size: UDim2.fromScale(0.25, 0.425),
				BackgroundColor3: Color3.fromRGB(0, 131, 213),
				Image: "",
			}}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Position: binding.map((value) => UDim2.fromScale(0.5, value)),
					Image: getPetImage(props.storedPet.id, props.storedPet.variant),
				}}
			/>
		</ImageButton>
	);
});

/**
 * A counter that displays the amount that globally exist.
 */
const ExistAmount = hooks((props: { storedPet: Pet }, { useState, useEffect }) => {
	const [existAmount, setExistAmount] = useState(0);
	useEffect(() => {
		const petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(props.storedPet.id) as Configuration;
		if (petExistCache === undefined) {
			return;
		}

		const variantCache = petExistCache.FindFirstChild(props.storedPet.variant) as IntValue;
		if (variantCache === undefined) {
			return;
		}

		if (existAmount !== variantCache.Value) {
			setExistAmount(variantCache.Value);
		}
	});

	if (existAmount > 0) {
		return (
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.375, 0.6),
					Size: UDim2.fromScale(0.675, 0.1),
					TextColor3: Color3.fromRGB(255, 170, 255),
					Text: `⭐ ${twoDpAbbreviator.numberToString(existAmount)} Exist`,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(111, 74, 111) } }}
			/>
		);
	} else return <></>;
});

/**
 * Displays a summary of the pet being viewed in the item inventory.
 *
 * `inventoryFrame` is the frame in which all pets are rendered.
 */
export const PetSummary = hooks(
	(props: { storedPet: Pet; inventoryFrame: Roact.Ref<ScrollingFrame> }, { useEffect, useValue }) => {
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

			const connections: Array<RBXScriptConnection> = [];

			const mouseConnection = UserInputService.InputChanged.Connect((input) => {
				if (input.UserInputType !== Enum.UserInputType.MouseMovement) {
					return;
				}

				const inventoryFrame = props.inventoryFrame.getValue();
				if (!inventoryFrame) {
					return;
				}

				const inventoryPos = inventoryFrame.AbsolutePosition;
				const bottomRightInventory = inventoryPos.add(inventoryFrame.AbsoluteSize);

				// calculate where the bottom right of the petSummary frame should be
				const desiredBottomRightPos = new Vector2(input.Position.X, input.Position.Y).add(petSummary.AbsoluteSize);
				// shift it up if needed
				const yPos =
					math.clamp(desiredBottomRightPos.Y, inventoryPos.Y, bottomRightInventory.Y) -
					petFrame.AbsolutePosition.Y -
					petSummary.AbsoluteSize.Y;
				// our x position is either to the left or to the right
				// by default it's to the right, but if there is no space on the right
				// then we will shift it to the left
				const xPos =
					input.Position.X -
					(desiredBottomRightPos.X < bottomRightInventory.X
						? // display on right
						  0
						: // display on left
						  petSummary.AbsoluteSize.X) -
					petFrame.AbsolutePosition.X;

				const offset = new Vector2(xPos, yPos);
				petSummary.Position = UDim2.fromOffset(offset.X, offset.Y);
			});
			connections.push(mouseConnection);

			return (): void => connections.forEach((conn) => conn.Disconnect());
		}, []);

		return (
			<imagelabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(2.2, 2.2)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image={assetIds.images.ui.inventory.petSummary}
				ScaleType={Enum.ScaleType.Fit}
				Ref={petSummaryRef.value}
			>
				<uiaspectratioconstraint AspectRatio={0.845} />
				<PetView storedPet={props.storedPet} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.625, 0.125),
						Position: UDim2.fromScale(0.635, 0.075),
						Text: petData.name,
						TextColor3:
							petData.rarity === "Epic" ||
							petData.rarity === "Legendary" ||
							petData.rarity === "Primordial" ||
							petData.rarity === "Prismatic"
								? rarityData.BeginningColor
								: Color3.fromRGB(255, 255, 255),
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				>
					<RarityGradient Rarity={petData.rarity} />
				</StrokeTextLabel>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.625, 0.1),
						Position: UDim2.fromScale(0.635, 0.2),
						Text: petData.rarity,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				>
					<RarityGradient Rarity={petData.rarity} />
				</StrokeTextLabel>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.625, 0.1),
						Position: UDim2.fromScale(0.35, 0.3),
						Text: `Level: ${petLevel >= 1 ? petLevel : 1}`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.735, 0.4),
						Size: UDim2.fromScale(0.35, 0.1),
						TextColor3: Color3.fromRGB(230, 64, 64),
						Text: twoDpAbbreviator.numberToString(getPetStrength(props.storedPet)),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) } }}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
				</StrokeTextLabel>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.625, 0.1),
						Position: UDim2.fromScale(0.35, 0.4),
						Text: `Damage:`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.08),
						Position: UDim2.fromScale(0.485, 0.5),
						Text:
							props.storedPet.variant !== "radiant"
								? `${tostring(petData.chance)}% Hatch Chance`
								: `Cannot be hatched.`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.75 } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.8),
						Size: UDim2.fromScale(0.675, 0.1),
						TextColor3: Color3.fromRGB(230, 64, 64),
						Text: "Enhancement",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(105, 0, 0) } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.9),
						Size: UDim2.fromScale(0.675, 0.075),
						Text: "Coming Soon",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<ExistAmount storedPet={props.storedPet} />
			</imagelabel>
		);
	},
);
