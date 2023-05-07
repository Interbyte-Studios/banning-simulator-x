import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { WeaponViewport } from "client/ui/elements/viewports/weaponViewport";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Weapon } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * An item frame for a specified weapon.
 */
export const WeaponItemFrame = hooks(
	(props: { storedWeapon: Weapon; isEquipped: boolean; displayWeaponInfo: (weaponId: number) => void }) => {
		const weaponData = getWeaponInfo(props.storedWeapon.id);

		const additionalElements: Array<Roact.Element> = [];
		if (props.storedWeapon.level > 1) {
			const storedWeaponElement = (
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.95),
						Size: UDim2.fromScale(0.7, 0.2),
						Text: `Level: ${props.storedWeapon.level}`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
			);

			additionalElements.push(storedWeaponElement);
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.storedWeapon.id}>
				<ImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: props.isEquipped ? Color3.fromRGB(85, 255, 127) : Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.displayWeaponInfo(props.storedWeapon.id);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
					<WeaponViewport weaponId={props.storedWeapon.id} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.2),
							Position: UDim2.fromScale(0.5, 0.1),
							Text: weaponData.name,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					{additionalElements}
				</ImageButton>
			</frame>
		);
	},
);
