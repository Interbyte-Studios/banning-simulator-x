import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { ACCOLADES } from "shared/configs/accolades";
import { StoreState } from "shared/rodux";
import { AccoladeState } from "shared/rodux/accolade";

import { FullComponentHeader } from "../account/util/fullComponentHeader";
import { AccoladeCard } from "./accoladeCard";

interface AccoladesProps extends AccoladesMappedProps {
	hideMenu: () => void;
}

interface AccoladesMappedProps {
	accolades: AccoladeState;
}

/**
 * Gets the accolades from the rodux store.
 *
 * @param state The rodux store state.
 * @returns The accolades from the rodux store.
 */
const mapStateToProps = (state: StoreState): AccoladesMappedProps => {
	return {
		accolades: state.accolades,
	};
};

/**
 * An accolades section displaying user achievements.
 */
export const Accolades = RoactRodux.connect(mapStateToProps)(
	hooks((props: AccoladesProps, hooks) => {
		const { useValue, useEffect } = hooks;

		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Accolades UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Accolades ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Accolades to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((card) => {
				if (card.IsA("Frame")) {
					card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4.5);
				}
			});
		});

		const playerStore = retrieveStore(Players.LocalPlayer);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.65, 0.65),
					Image: assetIds.images.ui.account.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.5} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.4, 0.135),
						Position: UDim2.fromScale(0.5, 0.08),
						Text: "Accolades",
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) },
					}}
				/>

				<FullComponentHeader
					storeFound={true}
					headerText={`${Players.LocalPlayer.Name}'s Accolades`}
					returnToSelection={props.hideMenu}
					displayReturn={false}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={10}
					BorderSizePixel={0}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Ref={uiListLayoutRef.value}
						Padding={new UDim(0.01, 0)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					{ACCOLADES.map((accoladeData): Roact.Element => {
						const ownsAccolade = props.accolades.find((accoladeId) => accoladeId === accoladeData.id);
						const accoladeProgress =
							playerStore !== undefined
								? accoladeData.progress(playerStore.getState())
								: { progressPercentage: 0, progress: 0, maxProgress: 500 };

						return (
							<AccoladeCard
								ownsAccolade={ownsAccolade !== undefined}
								accoladeProgress={accoladeProgress}
								accoladeData={accoladeData}
							/>
						);
					})}
				</RescalingScrollingFrame>

				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={props.hideMenu}
				/>
			</ImageLabel>
		);
	}),
);
