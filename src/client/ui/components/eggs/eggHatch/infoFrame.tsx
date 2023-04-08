import Roact from "@rbxts/roact";
import { font, udim2TopMiddle, vec2Middle } from "client/ui/commonValues";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { PetViewport } from "client/ui/elements/viewports/petViewport";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
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
		autoDelete.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.65, 0)}
				Size={UDim2.fromScale(0.7, 0.3)}
				Text={"(Auto Deleted)"}
				TextColor3={Color3.fromRGB(230, 112, 112)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 2 }} />
			</textlabel>,
		);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={infoFramePositions[props.id]}
			Size={UDim2.fromScale(0.175, 0.12)}
		>
			<uiaspectratioconstraint AspectRatio={2.2} />

			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.125, 0.3)}
				Size={UDim2.fromScale(0.25, 0.625)}
			>
				<PetViewport petId={props.pet} variant={props.isVoid ? "void" : "regular"} shouldBlackout={false}>
					<uiaspectratioconstraint AspectRatio={1} />
				</PetViewport>
			</frame>

			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.7, 0.45)}
				Position={UDim2.fromScale(0.65, 0.375)}
				Font={font}
				Text={string.upper(petInfo.name)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2 }} />
			</textlabel>

			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.7, 0.35)}
				Position={UDim2.fromScale(0.65, 0.75)}
				Font={font}
				Text={string.upper(petInfo.rarity)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<RarityGradient Rarity={petInfo.rarity} />
				<BaseUIStroke native={{ Thickness: 2 }} />
			</textlabel>
			{autoDelete}
		</frame>
	);
}
