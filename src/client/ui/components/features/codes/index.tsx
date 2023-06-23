import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, uiHeaderStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";
import { StoreState } from "shared/rodux";

interface CodesProps extends CodesMappedProps {
	hideMenu: () => void;
}

interface CodesMappedProps {
	discordVerified: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): CodesMappedProps {
	return {
		discordVerified: state.media.discordVerified,
	};
}

export const Codes = RoactRodux.connect(mapStateToProps)(
	hooks((props: CodesProps, hooks) => {
		const maxSize = 0.175;
		const minSize = 0.15;

		const { useValue, useContext } = hooks;
		const { redeemCode } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const codeTextBox = useValue(Roact.createRef<TextBox>());

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.425),
					Image: assetIds.images.ui.codes.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2.1} />
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.505, 0.115),
						Size: UDim2.fromScale(0.375, 0.185),
						Text: "Codes",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.125)}
					minimizedSize={0.1}
					maximizedSize={0.15}
					onClosed={(): void => props.hideMenu()}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.465),
						Size: UDim2.fromScale(0.9, 0.45),
						Text: "Follow @TenrousR, @RealNotNert, and @InterbyteRBLX on Twitter for exclusive codes!",
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.4, 0.85)}
					Size={UDim2.fromScale(0.75, 0.15)}
				>
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textbox
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.5)}
						PlaceholderText={"Input Twitter Code"}
						PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
						Text={""}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
						TextScaled={true}
						Ref={codeTextBox.value}
					>
						<BaseUIStroke native={{ Thickness: 1.2 }} />
					</textbox>
				</BaseFrame>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.895, 0.85),
						Image: assetIds.images.ui.index.Claim,
						ScaleType: Enum.ScaleType.Fit,
					}}
					size={{ maxSize: maxSize, minSize: minSize }}
					events={{
						/**
						 *
						 */
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MajorEngagement);

							const textBox = codeTextBox.value.getValue();
							if (textBox === undefined) {
								addAnnouncement("Please input your handle to verify.", AnnouncementType.Error);
								return;
							}

							const codeRedeemed = await redeemCode.CallServerAsync(textBox.Text);
							if (codeRedeemed.success) {
								addAnnouncement(`You've redeemed the code "${textBox.Text}."`, AnnouncementType.Announcement);
								return;
							} else {
								switch (codeRedeemed.reason) {
									case RedeemCodeFailKind.AlreadyRedeemed: {
										addAnnouncement("You have already redeemed that code.", AnnouncementType.Error);
										return;
									}
									case RedeemCodeFailKind.InvalidCode: {
										addAnnouncement(`The code you entered "${textBox.Text}" is invalid.`, AnnouncementType.Error);
										return;
									}
									default: {
										addAnnouncement("An unknown error occurred.", AnnouncementType.Error);
										return;
									}
								}
							}
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Redeem",
						}}
						stroke={{ native: { Thickness: 1.2 } }}
					/>
				</SpringImageButton>
			</ImageLabel>
		);
	}),
);
