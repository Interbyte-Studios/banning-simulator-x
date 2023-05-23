// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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

		const { useContext } = hooks;
		const { togglePetMasteryCosmetic } = useContext(remoteContext);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.6, 0.2),
					Position: UDim2.fromScale(0.5, 1.07),
					Image: assetIds.images.ui.index.footerNotice,
				}}
			>
				<uiaspectratioconstraint AspectRatio={6.43} />

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.875, 0.5),
						Image:
							petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled
								? assetIds.images.ui.index.Claim
								: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.6, maxSize: 0.7 }}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

							if (!canToggleCosmetic) {
								// add error
								return;
							}

							togglePetMasteryCosmetic.SendToServer(props.pet, props.variant);
						},
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled ? "On" : "Off",
						}}
						stroke={{
							native: {
								Thickness: 1.6,
								Color:
									petsMastery !== undefined && petsMastery[props.variant].cosmeticEnabled
										? Color3.fromRGB(40, 98, 48)
										: Color3.fromRGB(82, 18, 18),
							},
						}}
					/>
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.385, 0.5),
						Size: UDim2.fromScale(0.75, 1),
						Text: `Pet Mastery Cosmetic`,
					}}
					stroke={{ native: { Thickness: 1.6, Color: Color3.fromRGB(255, 84, 84) } }}
				/>
			</ImageLabel>
		);
	}),
);
