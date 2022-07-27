import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { EggName } from "shared/configs/eggs";
import { getItemById } from "shared/util/getItemById";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { hooks } from "../hooks";

interface PetViewportProps {
	native: Partial<WritableInstanceProperties<ViewportFrame>>;
	eggName: EggName;
	petId: number;
}

/**
 * A viewport of a pet.
 *
 * @param props The properties of the pet viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.eggName The name of the egg the pet comes from.
 * @param props.petId The id of the pet being displayed.
 */
export const PetViewport = hooks((props: PetViewportProps, { useValue, useEffect }) => {
	const viewportRef = useValue(Roact.createRef<ViewportFrame>());
	const cameraRef = useValue(Roact.createRef<Camera>());

	useEffect(() => {
		const viewport = viewportRef.value.getValue();
		assert(viewport, `Failed to get Viewport Frame`);

		const camera = cameraRef.value.getValue();
		assert(camera, `Failed to get camera.`);

		viewport.CurrentCamera = camera;

		const petsFolder = ReplicatedStorage.assetObjects.pets;

		const petModel = getItemById(petsFolder[props.eggName], props.petId);
		assert(petModel, `Did not find pet model for pet with id ${props.petId}`);

		const pet = petModel.Clone() as Model;
		setAssetProperties("pet", pet, false);

		assert(pet.PrimaryPart, `Failed to get Primary Part for pet ${pet.Name} of id ${props.petId}`);

		pet.Parent = viewport;

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 10;

		const [, petSize] = pet.GetBoundingBox();
		pet.SetPrimaryPartCFrame(
			camera.CFrame.ToWorldSpace(new CFrame(0, -petSize.Y / 50, -petSize.Z * 5)).mul(
				CFrame.Angles(0, math.rad(180), 0),
			),
		);
	}, []);

	return (
		<viewportframe {...props.native} Ref={viewportRef.value}>
			<camera Ref={cameraRef.value} />
		</viewportframe>
	);
});
