import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { getItemById } from "shared/util/getItemById";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { hooks } from "../hooks";

interface PetViewportProps extends Partial<ViewportFrame> {
	petId: number;
}

export const PetViewport = hooks((props: PetViewportProps, { useValue, useEffect }) => {
	const viewportRef = useValue(Roact.createRef<ViewportFrame>());
	const cameraRef = useValue(Roact.createRef<Camera>());

	useEffect(() => {
		const viewport = viewportRef.value.getValue();
		assert(viewport, `Failed to get Viewport Frame`);

		const camera = cameraRef.value.getValue();
		assert(camera, `Failed to get camera.`);

		const petsFolder = ReplicatedStorage.assetObjects.pets;

		const petModel = getItemById(petsFolder, props.petId);
		assert(petModel, `Did not find pet model for pet with id ${props.petId}`);

		const pet = petModel.Clone() as Model;
		setAssetProperties("pet", pet, false);

		assert(pet.PrimaryPart, `Failed to get Primary Part for pet ${pet.Name} of id ${props.petId}`);

		pet.Parent = viewport;

		camera.CFrame = pet.PrimaryPart.CFrame.mul(new CFrame(0, -5, 0));
	}, []);

	return (
		<viewportframe {...props} Ref={viewportRef.value}>
			<camera Ref={cameraRef.value} />
		</viewportframe>
	);
});
