import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";

interface RewardSlotProps {
	pos: UDim2;
	image: string;
	amount: number;
	rot?: number;
}

export const RewardSlot = hooks((props: RewardSlotProps) => {
	return (
		<frame
			Position={props.pos}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.222, 0.32)}
			Rotation={props.rot ?? 0}
		>
			<imagelabel
				Image={props.image}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.3)}
				Size={UDim2.fromScale(0.9, 0.625)}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.8)}
				Size={UDim2.fromScale(0.55, 0.25)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"x" + tostring(props.amount)}
				TextScaled={true}
				Font={font}
				BackgroundTransparency={1}
			>
				<BaseUIStroke
					native={{
						Thickness: 2,
						Color: Color3.fromRGB(11, 52, 68),
					}}
				/>
			</textlabel>
		</frame>
	);
});
