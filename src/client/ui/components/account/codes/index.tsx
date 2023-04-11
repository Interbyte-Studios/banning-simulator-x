import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, PolicyService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";
import { VerifyDiscordFailKind } from "shared/remotes/media/verifyDiscord";
import { StoreState } from "shared/rodux";

import { RightComponentHeader } from "../util/rightComponentHeader";

interface CodesProps extends CodesMappedProps {
	returnToSelection: () => void;
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

/**
 * A media interface for codes from Twitter and Discord.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const Codes = RoactRodux.connect(mapStateToProps)(
	hooks((props: CodesProps, hooks) => {
		const maxSize = 0.125;
		const minSize = 0.1;

		const maximizedSpring = new Flipper.Spring(maxSize, { frequency: 5 });
		const minimizedSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const codesMotor = useBindingMotor(hooks, maxSize);
		const discordMotor = useBindingMotor(hooks, maxSize);

		const { useValue, useContext } = hooks;
		const { redeemCode, verifyDiscord } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const codeTextBox = useValue(Roact.createRef<TextBox>());
		const discordTextBox = useValue(Roact.createRef<TextBox>());

		const availableThirdPartyLinks = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
		const discordAvailable = useValue(
			availableThirdPartyLinks.AllowedExternalLinkReferences.find((x) => x === "Discord") !== undefined,
		);

		const discordComponents: Array<Roact.Element> = [];
		if (discordAvailable.value) {
			discordComponents.push(
				<>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.72, 0.7)}
						Size={UDim2.fromScale(0.535, 0.2)}
						Text={"Join our Discord server [https://discord.gg/interbyte] for a permanent 50% experience boost!"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
					<frame
						AnchorPoint={vec2Middle}
						BackgroundColor3={Color3.fromRGB(0, 131, 213)}
						Position={UDim2.fromScale(0.65, 0.85)}
						Size={UDim2.fromScale(0.4, 0.125)}
					>
						<uiaspectratioconstraint AspectRatio={7} />
						<uicorner CornerRadius={new UDim(0.075, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
						<textbox
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.95, 0.5)}
							PlaceholderText={"Input Tag (User#0001)"}
							PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
							Text={""}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={font}
							TextScaled={true}
							Ref={discordTextBox.value}
						>
							<BaseUIStroke native={{ Thickness: 1.2 }} />
						</textbox>
					</frame>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.925, 0.85)}
						Size={discordMotor.binding.map((value) => {
							return UDim2.fromScale(value, 1);
						})}
						Image={assetIds.images.ui.index.Claim}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: async (): Promise<void> => {
								playSFX(UIEngagement.MajorEngagement);

								if (props.discordVerified) {
									addAnnouncement("You have already been verified.", AnnouncementType.Error);
									return;
								}

								const textBox = discordTextBox.value.getValue();
								if (textBox === undefined) {
									addAnnouncement("Please input your tag to verify.", AnnouncementType.Error);
									return;
								}

								const verifyDiscordPresence = await verifyDiscord.CallServerAsync(textBox.Text);
								if (verifyDiscordPresence.success) {
									addAnnouncement(
										"You have been verified! Enjoy your 50% experience boost :)",
										AnnouncementType.Announcement,
									);
									return;
								} else {
									switch (verifyDiscordPresence.reason) {
										case VerifyDiscordFailKind.InternalError: {
											addAnnouncement("An error occurred while verifying your info (100).", AnnouncementType.Error);
											return;
										}
										case VerifyDiscordFailKind.NotInDiscord: {
											addAnnouncement("You are not in the Interbyte Discord server.", AnnouncementType.Error);
											return;
										}
										case VerifyDiscordFailKind.RateLimit: {
											addAnnouncement("You have been rate limited.", AnnouncementType.Error);
											return;
										}
									}
								}
							},
							MouseEnter: (): void => discordMotor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => discordMotor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<textlabel
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.8, 0.8)}
							BackgroundTransparency={1}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Text={"Verify"}
							Font={font}
						>
							<BaseUIStroke native={{ Thickness: 1.2 }} />
						</textlabel>
					</imagebutton>
				</>,
			);
		}

		return (
			<>
				<RightComponentHeader
					storeFound={true}
					headerText={`Codes [${Players.LocalPlayer.Name}]`}
					returnToSelection={props.returnToSelection}
					displayReturn={true}
				/>

				{/* Codes */}
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.72, 0.365)}
					Size={UDim2.fromScale(0.535, 0.2)}
					Text={"Follow @TenrousR, @RealNotNert, and @InterbyteRBLX on Twitter for exclusive codes!"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.65, 0.515)}
					Size={UDim2.fromScale(0.4, 0.125)}
				>
					<uiaspectratioconstraint AspectRatio={7} />
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
				</frame>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.925, 0.515)}
					Size={codesMotor.binding.map((value) => {
						return UDim2.fromScale(value, 1);
					})}
					Image={assetIds.images.ui.index.Claim}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
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
								}
							}
						},
						MouseEnter: (): void => codesMotor.motor.setGoal(minimizedSpring),
						MouseLeave: (): void => codesMotor.motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Redeem"}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.2 }} />
					</textlabel>
				</imagebutton>

				{/* Discord */}
				{discordComponents}
			</>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
