import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/**
 * Equips the best pets a player can have.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EquipBestPets = hooks((_, hooks) => {
	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.1, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.7, 0.7)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Equip Best"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Unequips the player's currently equipped pets.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const UnequipPets = hooks((_, hooks) => {
	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.31, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.8, 0.7)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Unequip All"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Toggles an interface for the player's pet teams.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleTeams = hooks((_, hooks) => {
	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.52, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.65, 0.6)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Teams"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Toggles between types of sorting options for the pet inventory.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleSort = hooks((_, hooks) => {
	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.9, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.65, 0.6)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Strength"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * A bottom bar interface of the pet inventory component providing player with extra control over their items.
 */
export const PetInventoryBottomControl = hooks(() => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0.14)}
			Position={UDim2.fromScale(0.5, 0.95)}
			Image={assetIds.images.ui.inventory.pets.bottombar}
			ScaleType={Enum.ScaleType.Fit}
		>
			<EquipBestPets />
			<UnequipPets />
			<ToggleTeams />
			<ToggleSort />
		</imagelabel>
	);
});
