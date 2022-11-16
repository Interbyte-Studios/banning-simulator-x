import Roact from "@rbxts/roact";
import { Players, PolicyService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { DiscordHandle } from "./discordHandle";
import { TwitterHandle } from "./twitterHandle";

interface CodesMenuProps {
	visible: boolean;
	hideMenu: () => void;
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
}

export const CodesMenu = hooks((props: CodesMenuProps) => {
	if (!props.visible) {
		return <></>;
	}

	let discordAvailable = false;

	const availableThirdPartyLinks = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
	discordAvailable = availableThirdPartyLinks.AllowedExternalLinkReferences.find((x) => x === "Discord") !== undefined;

	const mediaComponents: Array<Roact.Element> = [];
	mediaComponents.push(
		<>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.275)}
				Size={UDim2.fromScale(0.9, 0.25)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Follow @TenrousR, @RealNotNert, and @InterbyteRBLX on Twitter for exclusive codes!"}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>
			<TwitterHandle displayAnnouncement={props.displayAnnouncement} />
		</>,
	);

	if (discordAvailable) {
		mediaComponents.push(
			<>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.7)}
					Size={UDim2.fromScale(0.9, 0.25)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Join our Discord server [https://discord.gg/interbyte] for a permanent 50% experience boost!"}
					Font={font}
				>
					<BaseUIStroke Thickness={2} />
				</textlabel>
				<DiscordHandle displayAnnouncement={props.displayAnnouncement} />
			</>,
		);
	} else {
		mediaComponents.push(
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.7)}
				Size={UDim2.fromScale(0.9, 0.25)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Not all media features are displayed, as some are not allowed in your region."}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>,
		);
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.35, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.codes.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.1} />
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.06)}
				Size={UDim2.fromScale(0.4, 0.125)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Media"}
				Font={font}
			>
				<BaseUIStroke Thickness={3} />
			</textlabel>
			{mediaComponents}
			<ExitButton
				Position={UDim2.fromScale(0.95, 0.075)}
				minimizedSize={0.1}
				maximizedSize={0.125}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
