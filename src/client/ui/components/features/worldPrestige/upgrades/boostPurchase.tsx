import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { BOOST_IMAGES, BoostProduct } from "shared/configs/game";
import { WorldName } from "shared/configs/worlds";
import { ValidBoostTime } from "shared/rodux/boosts";

/**
 * A component to display a World Prestige boost purchase.
 */
export const WorldPrestigeBoostPurchase = hooks(
	(
		props: {
			worldName: WorldName;
			boostName: BoostProduct;
			boostTime: ValidBoostTime;
			prestigeTokens: number;
			cost: number;
			position: UDim2;
		},
		{ useContext },
	) => {
		const { purchasePrestigeBoost } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		const boostDisplay =
			props.boostName === "x2 Hatching Luck"
				? "x2 Luck"
				: props.boostName === "x2 Pet Experience"
				? "x2 Pet XP"
				: props.boostName === "x2 Rank Experience"
				? "x2 Rank XP"
				: props.boostName;
		const timeDisplay = props.boostTime === 60 ? "(1h)" : props.boostTime === 120 ? "(2h)" : `(${props.boostTime}m)`;

		return (
			<BaseFrame
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				BackgroundTransparency={0}
				Position={props.position}
				Size={UDim2.fromScale(0.28, 0.28)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 3, Color: uiDarkStrokeColor }} />

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.9, 0.85),
						Image: assetIds.images.vectors.trading.Upgrade,
						ImageColor3: props.prestigeTokens < 1 ? Color3.fromRGB(127, 127, 127) : Color3.fromRGB(255, 255, 255),
					}}
					size={{ minSize: 0.23, maxSize: 0.28 }}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							if (props.prestigeTokens < props.cost) {
								addAnnouncement(`You don't have enough prestige tokens!`, AnnouncementType.Error);
								return;
							}

							purchasePrestigeBoost.SendToServer(props.worldName, props.boostName, props.boostTime);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</SpringImageButton>

				<SpringImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.45),
						Image: BOOST_IMAGES[props.boostName][props.boostTime],
					}}
					size={{ minSize: 0.6, maxSize: 0.7 }}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</SpringImageLabel>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.025),
						Size: UDim2.fromScale(1, 0.155),
						Text: `${boostDisplay} ${timeDisplay}`,
					}}
					stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.4, 0.87),
						Size: UDim2.fromScale(0.7, 0.2),
						Text: `Buy (${props.cost} Tokens)`,
						TextXAlignment: Enum.TextXAlignment.Right,
					}}
					stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
				/>
			</BaseFrame>
		);
	},
);
