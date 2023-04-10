import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { PetViewport } from "client/ui/elements/viewports/petViewport";
import { EggName } from "shared/configs/eggs";
import { getPetData } from "shared/util/getPetData";
import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

interface InfoFrameProps {
	id: 1 | 2 | 3;
	eggName: EggName;
	pet: number;
	isVoid: boolean;
	autoDeleted: boolean;
}

/**
 * Displays information about a pet.
 *
 * @param props Properties of the component.
 * @param props.id An id deciding the position on the screen where the component is displayed.
 * @param props.eggName The name of the egg that the pet was hatched from.
 * @param props.pet The id of the pet that was hatched.
 * @param props.isVoid Whether or not the pet is void.
 * @returns A roact element.
 */
export function InfoFrame(props: InfoFrameProps): Roact.Element {
	const infoFramePositions = preserveWithConstraint<Record<1 | 2 | 3, UDim2>>()({
		3: UDim2.fromScale(0.75, 0.75),
		1: UDim2.fromScale(0.5, 0.75),
		2: UDim2.fromScale(0.25, 0.75),
	});

	const petInfo = getPetData(props.pet);

	const autoDelete: Array<Roact.Element> = [];
	if (props.autoDeleted) {
		const autoDeletedMessage = (
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.65, 0),
					Size: UDim2.fromScale(0.7, 0.3),
					Text: "(Auto Deleted)",
					TextColor3: Color3.fromRGB(230, 112, 112),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2 } }}
			/>
		);

		autoDelete.push(autoDeletedMessage);
	}

	return (
		<BaseFrame Position={infoFramePositions[props.id]} Size={UDim2.fromScale(0.175, 0.12)}>
			<uiaspectratioconstraint AspectRatio={2.2} />

			<BaseFrame Position={UDim2.fromScale(0.125, 0.3)} Size={UDim2.fromScale(0.25, 0.625)}>
				<PetViewport petId={props.pet} variant={props.isVoid ? "void" : "regular"} shouldBlackout={false}>
					<uiaspectratioconstraint AspectRatio={1} />
				</PetViewport>
			</BaseFrame>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.65, 0.375),
					Size: UDim2.fromScale(0.7, 0.45),
					Text: string.upper(petInfo.name),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2 } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.65, 0.75),
					Size: UDim2.fromScale(0.7, 0.35),
					Text: string.upper(props.eggName),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2 } }}
			>
				<RarityGradient Rarity={petInfo.rarity} />
			</StrokeTextLabel>

			{autoDelete}
		</BaseFrame>
	);
}
