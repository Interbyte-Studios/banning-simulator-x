import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";

import { DiscordRewards } from "./discordRewards";
import { DiscordVerify } from "./discordVerify";

interface DiscordHandleMappedProps {
	enabled: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): DiscordHandleMappedProps {
	return {
		enabled: state.media.discord,
	};
}

export const DiscordHandle = RoactRodux.connect(mapStateToProps)(
	hooks((props: DiscordHandleMappedProps) => {
		if (props.enabled) {
			return <DiscordRewards />;
		}

		return (
			<>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.375, 0.875)}
					Size={UDim2.fromScale(0.65, 0.125)}
					Image={assetIds.images.ui.codes.input}
					ScaleType={Enum.ScaleType.Fit}
				>
					<textbox
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.5)}
						PlaceholderText={"Discord Tag (e.g. Interbyte#0001)"}
						PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
						Text={""}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
						TextScaled={true}
					>
						<BaseUIStroke Thickness={1.2} />
					</textbox>
				</imagelabel>
				<DiscordVerify />
			</>
		);
	}),
);
