import Roact from "@rbxts/roact";
import { font, udim2TopMiddle, vec2Middle } from "client/ui/commonValues";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { PetViewport } from "client/ui/elements/petViewport";
import { RarityGradient } from "client/ui/elements/rarityGradient";
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

	const petInfo = getPetData(props.eggName, props.pet);

	const autoDelete: Array<Roact.Element> = [];
	if (props.autoDeleted) {
		autoDelete.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 1.25)}
				Size={UDim2.fromScale(0.65, 0.4)}
				Text={"(Auto Deleted)"}
				TextColor3={Color3.fromRGB(230, 112, 112)}
				TextScaled={true}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
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
			<BaseTextLabel
				Position={UDim2.fromScale(0.7, 0.3)}
				Size={UDim2.fromScale(0.8, 0.55)}
				Text={string.upper(petInfo.name)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<PetViewport
					native={{
						AnchorPoint: new Vector2(1, 0.5),
						Position: udim2TopMiddle,
						Size: UDim2.fromScale(0.4, 1.15),
						BackgroundTransparency: 1,
					}}
					eggName={props.eggName}
					petId={props.pet}
					isVoid={props.isVoid}
				/>
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
			<BaseTextLabel
				Position={UDim2.fromScale(0.5, 0.875)}
				Size={UDim2.fromScale(0.75, 0.4)}
				Text={string.upper(petInfo.rarity)}
			>
				<RarityGradient Rarity={petInfo.rarity} />
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
			{autoDelete}
		</frame>
	);
}
