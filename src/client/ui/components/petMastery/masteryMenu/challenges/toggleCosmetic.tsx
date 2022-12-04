import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import {
	PetMasteryState,
	radiantVariantMasteryData,
	regularVariantMasteryData,
	voidVariantMasteryData,
} from "shared/rodux/petMastery";

interface ToggleCosmeticProps extends ToggleCosmeticMappedProps {
	pet: number;
	variant: Variants;
}

interface ToggleCosmeticMappedProps {
	petMastery: PetMasteryState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): ToggleCosmeticMappedProps {
	return {
		petMastery: state.petMastery,
	};
}

/**
 * Displays the toggleable cosmetic reward for achieving pet mastery.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const TogglePetMasteryCosmetic = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleCosmeticProps, hooks) => {
		const petsMastery = props.petMastery.get(props.pet);

		let canToggleCosmetic = false;
		if (petsMastery !== undefined) {
			const masteryData = petsMastery[props.variant];

			switch (props.variant) {
				case "regular": {
					assert(regularVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					canToggleCosmetic = masteryData.hatchClaimed && masteryData.maxLevelClaimed;
					break;
				}
				case "void": {
					assert(voidVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					canToggleCosmetic = masteryData.hatchClaimed && masteryData.maxLevelClaimed && masteryData.fuseClaimed;
					break;
				}
				case "radiant": {
					assert(radiantVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					canToggleCosmetic = masteryData.maxLevelClaimed && masteryData.fuseClaimed;
					break;
				}
			}
		}

		const minimizedSize = 0.6;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.7;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const { useContext } = hooks;
		const { togglePetMasteryCosmetic } = useContext(remoteContext);

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.6, 0.2)}
				Position={UDim2.fromScale(0.5, 1.07)}
				Image={assetIds.images.ui.index.footerNotice}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={6.43} />

				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.875, 0.5)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.6, value);
					})}
					Image={
						petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled
							? assetIds.images.ui.index.Claim
							: assetIds.images.ui.index.Off
					}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

							if (!canToggleCosmetic) {
								// add error
								return;
							}

							togglePetMasteryCosmetic.SendToServer(props.pet, props.variant);
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Font={font}
						Text={petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled ? "On" : "Off"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke
							native={{
								Thickness: 1.6,
								Color:
									petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled
										? Color3.fromRGB(40, 98, 48)
										: Color3.fromRGB(82, 18, 18),
							}}
						/>
					</textlabel>
				</imagebutton>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.385, 0.5)}
					Size={UDim2.fromScale(0.75, 1)}
					Font={font}
					Text={`Pet Mastery Cosmetic`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.6, Color: Color3.fromRGB(255, 84, 84) }} />
				</textlabel>
			</imagelabel>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
