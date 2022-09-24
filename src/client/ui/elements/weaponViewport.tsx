import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { WeaponIndex } from "shared/configs/weapons";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { PetDistanceSetting } from "../components/settings/interactions/visual/petDistance";
import { hooks } from "../hooks";

interface WeaponViewportProps {
	native: Partial<WritableInstanceProperties<ViewportFrame>>;
	weaponName: WeaponIndex;
}

/**
 * A viewport of a weapon.
 *
 * @param props The properties of the weapon viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.weaponId The id of the weapon.
 */
export const WeaponViewport = hooks((props: WeaponViewportProps, { useValue, useEffect }) => {
	const viewportRef = useValue(Roact.createRef<ViewportFrame>());
	const cameraRef = useValue(Roact.createRef<Camera>());

	useEffect(() => {
		const viewport = viewportRef.value.getValue();
		assert(viewport, `Failed to get Viewport Frame`);

		viewport.Ambient = Color3.fromRGB(130, 130, 130);
		viewport.LightColor = Color3.fromRGB(255, 255, 255);

		const camera = cameraRef.value.getValue();
		assert(camera, `Failed to get camera`);

		viewport.CurrentCamera = camera;

		const weaponsFolder = ReplicatedStorage.assetObjects.weapons;
		const weaponTool = weaponsFolder[props.weaponName].Clone();
		setAssetProperties("weapon", weaponTool);

		const weaponModel = new Instance("Model");
		weaponTool.Parent = weaponModel;
		weaponModel.PrimaryPart = weaponTool.Handle;

		weaponModel.Parent = viewport;

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 10;

		weaponModel.PivotTo(
			camera.CFrame.ToWorldSpace(
				new CFrame(0, -weaponModel.GetExtentsSize().Y / 2.5, -weaponModel.GetExtentsSize().Z * 10).mul(
					CFrame.Angles(0, math.rad(90), 0),
				),
			),
		);
	}, []);

	return (
		<viewportframe {...props.native} Ref={viewportRef.value}>
			<camera Ref={cameraRef.value} />
		</viewportframe>
	);
});
