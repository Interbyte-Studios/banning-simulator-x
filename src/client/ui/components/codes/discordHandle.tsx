import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { VerifyDiscordFailKind } from "shared/remotes/media/verifyDiscord";
import { StoreState } from "shared/rodux";

import { DiscordRewards } from "./discordRewards";

interface DiscordHandleProps extends DiscordHandleMappedProps {
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
}

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
		enabled: state.media.discordVerified,
	};
}

const maximizedSize = 0.1;
const minimizedSize = 0.075;

/* eslint-disable jsdoc/require-jsdoc */
export const DiscordHandle = RoactRodux.connect(mapStateToProps)(
	hooks((props: DiscordHandleProps, hooks) => {
		if (props.enabled) {
			return <DiscordRewards />;
		}

		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const { useValue, useContext } = hooks;
		const { verifyDiscord } = useContext(remoteContext);

		const textBoxRef = useValue(Roact.createRef<TextBox>());

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
						Ref={textBoxRef.value}
					>
						<BSX_UIStroke defaultBlackColor={true} native={{ Thickness: 1.2 }} />
					</textbox>
				</imagelabel>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.84, 0.875)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.25, value);
					})}
					Image={assetIds.images.buttons["long green button"]}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: async (): Promise<void> => {
							const textBox = textBoxRef.value.getValue();
							if (textBox === undefined) {
								props.displayAnnouncement(
									"errors",
									"An internal error occurred while verifying your information. Please try again later.",
								);
								return;
							}

							const verifyDiscordPresence = await verifyDiscord.CallServerAsync(textBox.Text);
							if (verifyDiscordPresence.success) {
								props.displayAnnouncement(
									"announcements",
									"Congratulations! You have been verified! Enjoy your 50% experience boost :)",
								);
								return;
							} else {
								switch (verifyDiscordPresence.reason) {
									case VerifyDiscordFailKind.InternalError: {
										props.displayAnnouncement(
											"errors",
											"An internal error occurred while verifying your information. Please try again later.",
										);
										return;
									}
									case VerifyDiscordFailKind.NotInDiscord: {
										props.displayAnnouncement(
											"errors",
											"You are not in the Interbyte Discord server. Please join and try again.",
										);
										return;
									}
									case VerifyDiscordFailKind.RateLimit: {
										props.displayAnnouncement("errors", "You have been rate limited. Please try again later.");
										return;
									}
								}
							}
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.6)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Verify"}
						Font={font}
					>
						<BSX_UIStroke defaultBlackColor={true} native={{ Thickness: 1.2 }} />
					</textlabel>
				</imagebutton>
			</>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
