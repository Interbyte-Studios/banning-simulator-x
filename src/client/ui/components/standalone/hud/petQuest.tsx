import Roact from "@rbxts/roact";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { getPetDecal } from "client/util/getPetDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import { PET_QUEST_PET_ID } from "shared/configs/game";

/**
 * The icon for the pet quest.
 *
 * @param props The properties of the components.
 * @param props.displayPetQuest The function to call when the icon is clicked.
 * @returns The element to render.
 */
export const PetQuestIcon = (props: { displayPetQuest: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.706, 0.431),
				Image: "",
				BackgroundColor3: Color3.fromRGB(40, 168, 248),
				BackgroundTransparency: 0,
			}}
			size={{ minSize: 0.4, maxSize: 0.5 }}
			events={{
				/**
				 *
				 */
				Activated: (): void => {
					playSFX(UIEngagement.MajorEngagement);
					props.displayPetQuest();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={4} />
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(6, 117, 187) }} />

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.607, 0.5),
					Size: UDim2.fromScale(0.711, 0.766),
					Text: "Pet Quest",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.572, 0.085),
					Size: UDim2.fromScale(0.413, 0.417),
					Text: "OP Pet!!",
					TextColor3: Color3.fromRGB(255, 0, 0),
					FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(108, 31, 32) } }}
			/>

			<BaseFrame
				Position={UDim2.fromScale(0.07, 0.489)}
				Size={UDim2.fromScale(0.302, 1.349)}
				BackgroundColor3={Color3.fromRGB(40, 168, 248)}
				BackgroundTransparency={0}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(40, 168, 248) }} />

				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Image: getPetDecal(PET_QUEST_PET_ID, "regular"),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>
			</BaseFrame>
		</SpringImageButton>
	);
};
