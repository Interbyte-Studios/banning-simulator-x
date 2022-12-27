import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { ExperienceIcon } from "client/ui/elements/experienceIcon";
import { TalismanGradient } from "client/ui/elements/talismanGradient";
import { WalkSpeedIcon } from "client/ui/elements/walkspeedIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getTalismanDecal } from "client/util/getTalismanDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TALISMAN_PHASES } from "shared/configs/talismans";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { Talisman, TalismansState } from "shared/rodux/talismans";
import { getTalismanStatEffect } from "shared/util/getTalismanDamage";
import { getTalismanData } from "shared/util/getTalismanData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the talisman being viewed in the talisman info display.
 */
/* eslint-disable jsdoc/require-jsdoc */
const TalismanView = hooks((props: { storedTalisman: Talisman }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.5, 0.165)}
			Size={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Image={""}
			Event={{
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.85, 0.85)}
				Position={binding.map((value) => {
					return UDim2.fromScale(0.5, value);
				})}
				Image={getTalismanDecal(props.storedTalisman.id, props.storedTalisman.phase)}
				ScaleType={Enum.ScaleType.Fit}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
			/>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

interface TalismanInfoDisplayProps extends TalismanInfoDisplayMappedProps {
	id: number;
	shouldAnimate: boolean;
	hideDisplay: () => void;
}

interface EquipTalismanProps extends TalismanInfoDisplayMappedProps {
	storedTalisman: Talisman;
}

interface TalismanInfoDisplayMappedProps {
	talismans: TalismansState;
	currentTalisman: CurrentTalismanState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TalismanInfoDisplayMappedProps {
	return {
		talismans: state.talismans,
		currentTalisman: state.currentTalisman,
	};
}

/**
 * Equips/Unequips the talisman being viewed.
 */
/* eslint-disable jsdoc/require-jsdoc */
const EquipTalisman = RoactRodux.connect(mapStateToProps)(
	hooks((props: EquipTalismanProps, hooks) => {
		const maxSize = 0.5;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.425;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		const { useContext } = hooks;
		const { equipTalisman, unequipTalisman } = useContext(remoteContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={
					props.storedTalisman.id === props.currentTalisman
						? assetIds.images.ui["weapon shop"].locked
						: assetIds.images.ui["weapon shop"]["purchase button"]
				}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.storedTalisman.id === props.currentTalisman) {
							unequipTalisman.SendToServer();
						} else {
							equipTalisman.SendToServer(props.storedTalisman.id);
						}
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={props.storedTalisman.id === props.currentTalisman ? "Unequip" : "Equip"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke
						native={{
							Thickness: 1.5,
							Color:
								props.storedTalisman.id === props.currentTalisman
									? Color3.fromRGB(137, 150, 35)
									: Color3.fromRGB(18, 176, 13),
						}}
					/>
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays all the information about a stored talisman.
 */
export const TalismanInfoDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanInfoDisplayProps, hooks) => {
		const { useEffect } = hooks;

		const maximizedSize = 1.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

		const storedTalisman = props.talismans.find((talisman) => talisman.id === props.id);
		if (storedTalisman === undefined) {
			//warn(`Failed to display pet information for pet with guid: "${props.guid}".`);
			return <></>;
		}

		const capitalizedPhaseName =
			storedTalisman.phase === "artifact" ? "Artifact" : storedTalisman.phase === "awakend" ? "Awakend" : "Normal";

		const talismanInfo = getTalismanData(storedTalisman.id);
		const talismanPhaseInfo = TALISMAN_PHASES.find((phaseData) => phaseData.phase === storedTalisman.phase);
		assert(talismanPhaseInfo, `Failed to get talisman phase info for "${storedTalisman.phase}".`);
		const nextPhaseInfo =
			storedTalisman.phase === "artifact"
				? talismanPhaseInfo
				: TALISMAN_PHASES.find((phaseData) => phaseData.id === talismanPhaseInfo.id + 1);
		assert(nextPhaseInfo, `Failed to get talisman phase info for phase of id "${talismanPhaseInfo.id + 1}".`);

		const progressToNextPhase =
			storedTalisman.phase === "artifact" ? 1 : storedTalisman.bans / nextPhaseInfo.requiredBans;
		const talismanStatEffects = getTalismanStatEffect(storedTalisman.id, storedTalisman.phase);

		useEffect(() => {
			if (!props.shouldAnimate) {
				return;
			}

			motor.setGoal(maximizedSpring);
		});

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(-0.2, 0.5)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.4, value);
				})}
				Image={assetIds.images.ui.inventory["info sidebar"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={0.56} />

				<TalismanView storedTalisman={storedTalisman} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.08)}
					Position={UDim2.fromScale(0.5, 0.35)}
					Text={talismanInfo.name}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.07)}
					Position={UDim2.fromScale(0.5, 0.45)}
					Text={`Phase: ${capitalizedPhaseName}`}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<TalismanGradient phase={storedTalisman.phase} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.7, 0.625)}
					Size={UDim2.fromScale(0.45, 0.075)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(230, 64, 64)}
					Text={twoDpAbbreviator.numberToString(talismanStatEffects.damage)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.7, 0.71)}
					Size={UDim2.fromScale(0.45, 0.075)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(43, 185, 255)}
					Text={`+${twoDpAbbreviator.numberToString(talismanStatEffects.walkspeed)}`}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<WalkSpeedIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(21, 94, 127) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.7, 0.795)}
					Size={UDim2.fromScale(0.45, 0.075)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 235, 13)}
					Text={`x${twoDpAbbreviator.numberToString(talismanStatEffects.experience)}`}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<ExperienceIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(108, 99, 6) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.525)}
					Size={UDim2.fromScale(0.9, 0.05)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					<uicorner CornerRadius={new UDim(0.5)} />
					<frame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(progressToNextPhase, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</frame>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						Font={font}
						Text={storedTalisman.phase === "artifact" ? "Max Phase" : `${progressToNextPhase * 100}%`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
				</frame>
				<EquipTalisman storedTalisman={storedTalisman} />

				<ExitButton
					Position={UDim2.fromScale(0.965, 0.025)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => {
						motor.setGoal(minimizedSpring);
						task.spawn(() => task.delay(0.3, () => props.hideDisplay()));
					}}
				/>
			</imagelabel>
		);
	}),
);
