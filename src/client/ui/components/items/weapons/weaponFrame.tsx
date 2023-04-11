import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { WeaponViewport } from "client/ui/elements/viewports/weaponViewport";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Weapon } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * An item frame for a specified weapon.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const WeaponItemFrame = hooks(
	(props: { storedWeapon: Weapon; isEquipped: boolean; displayWeaponInfo: (weaponId: number) => void }) => {
		const weaponData = getWeaponInfo(props.storedWeapon.id);

		const additionalElements: Array<Roact.Element> = [];
		if (props.storedWeapon.level > 1) {
			additionalElements.push(
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.95)}
					Size={UDim2.fromScale(0.7, 0.2)}
					Font={font}
					Text={`Level: ${props.storedWeapon.level}`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>,
			);
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.storedWeapon.id}>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={props.isEquipped ? Color3.fromRGB(85, 255, 127) : Color3.fromRGB(46, 115, 179)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.925, 0.925)}
					Image={""}
					Event={{
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
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0.2)}
						Position={UDim2.fromScale(0.5, 0.1)}
						Text={weaponData.name}
						TextScaled={true}
						Font={font}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
					{additionalElements}
				</imagebutton>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
