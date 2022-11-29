import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { TalismanPhases } from "shared/configs/talismans";
import { getItemById } from "shared/util/getItemById";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { hooks } from "../hooks";

interface TalismanViewportProps {
	native: Partial<WritableInstanceProperties<ViewportFrame>>;
	talismanId: number;
	phase: TalismanPhases;
}

/**
 * A viewport of a talisman.
 *
 * @param props The properties of the talisman viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.talismanId The id of the talisman being displayed.
 */
export const TalismanViewport = hooks((props: TalismanViewportProps, { useValue, useEffect }) => {
	const viewportRef = useValue(Roact.createRef<ViewportFrame>());
	const cameraRef = useValue(Roact.createRef<Camera>());

	useEffect(() => {
		const viewport = viewportRef.value.getValue();
		assert(viewport, `Failed to get Viewport Frame`);

		viewport.Ambient = Color3.fromRGB(255, 255, 255);
		viewport.LightColor = Color3.fromRGB(255, 255, 255);

		const camera = cameraRef.value.getValue();
		assert(camera, `Failed to get camera`);

		viewport.CurrentCamera = camera;

		const talismansFolder = ReplicatedStorage.assetObjects.talismans;

		const talismanData = getTalismanData(props.talismanId);
		const talismanModelName =
			props.phase === "normal"
				? talismanData.name
				: props.phase === "artifact"
				? `Artifact ${talismanData.name}`
				: props.phase === "awakend"
				? `Awakend ${talismanData.name}`
				: "";

		let talismanModel: Model | undefined;
		for (const talisman of talismansFolder.GetDescendants()) {
			if (!talisman.IsA("Model")) {
				continue;
			}

			const talismanId = talisman.GetAttribute("id") as number;
			if (talismanId !== props.talismanId) {
				continue;
			}

			if (talisman.Name !== talismanModelName) {
				continue;
			}

			talismanModel = talisman;
		}
		assert(talismanModel, `Did not find talisman model for talisman with id ${props.talismanId}`);

		const talisman = talismanModel.Clone() as Model;
		setAssetProperties("talisman", talisman, undefined);

		assert(talisman.PrimaryPart, `Failed to get Primary Part for talisman ${talisman.Name} of id ${props.talismanId}`);

		if (viewport.FindFirstChildOfClass("Model")) {
			viewport.FindFirstChildOfClass("Model")?.Destroy();
		}

		talisman.Parent = viewport;

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 10;

		const [, talismanSize] = talisman.GetBoundingBox();
		talisman.PivotTo(
			camera.CFrame.ToWorldSpace(new CFrame(0, 0, -talismanSize.Z * talismanSize.Y * 1.6)).mul(
				CFrame.Angles(0, math.rad(270), 0),
			),
		);
	});

	return (
		<viewportframe {...props.native} Ref={viewportRef.value}>
			<camera Ref={cameraRef.value} />
		</viewportframe>
	);
});
