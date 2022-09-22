import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { WeaponIndex } from "shared/configs/weapons";
import { setAssetProperties } from "shared/util/setAssetProperties";

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

		const camera = cameraRef.value.getValue();
		assert(camera, `Failed to get camera.`);

		viewport.CurrentCamera = camera;

		const weaponFolder = ReplicatedStorage.assetObjects.weapons;
		const weaponTool = weaponFolder[props.weaponName].Clone();

		const weaponClone = weaponTool.Clone();
		setAssetProperties("weapon", weaponClone);

		const weaponModel = new Instance("Model");
		weaponModel.Name = weaponClone.Name;

		weaponClone.Parent = weaponModel;
		weaponModel.PrimaryPart = weaponClone.Handle;

		const [, weaponSize] = weaponModel.GetBoundingBox();
		//weaponModel.SetPrimaryPartCFrame(new CFrame(new Vector3(0, -1.5, 0)));
		weaponModel.Parent = viewport;

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 10;
	}, []);

	return (
		<viewportframe {...props.native} Ref={viewportRef.value}>
			<camera Ref={cameraRef.value} />
		</viewportframe>
	);
});
