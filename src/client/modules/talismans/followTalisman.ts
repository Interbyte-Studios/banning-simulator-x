import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { TalismanPhases } from "shared/configs/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

const talismansFolder = ReplicatedStorage.assetObjects.talismans;

/**
 * Equips a talisman to the player that follows them.
 *
 * @param player The local player.
 * @param talismanId The id of the talisman thats being equipped.
 * @param phase The phase of the talisman.
 */
export function equipTalisman(player: Player, talismanId: number, phase: TalismanPhases): void {
	const character = player.Character;
	assert(character, `Failed to get character for ${player.Name}. Cannot animate talisman.`);

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	assert(humanoid, `Failed to get Humanoid for ${player.Name}. Cannot animate talisman.`);

	const humanoidRootPart = humanoid.RootPart;
	assert(humanoidRootPart, `Failed to get HumanoidRootPart for ${player.Name}. Cannot animate talisman.`);

	const talismanData = getTalismanData(talismanId);

	const talismanFolder = talismansFolder.FindFirstChild(`Tier ${talismanData.id}`);
	assert(talismanFolder, `Failed to get talisman folder for talisman tier ${talismanData.id}`);

	const phaseName = phase === "awakend" ? "Awakend" : phase === "artifact" ? "Artifact" : "normal";
	const talismanModel = talismanFolder.FindFirstChild(
		phaseName === "normal" ? talismanData.name : `${phaseName} ${talismanData.name}`,
	);
	assert(talismanModel, `Failed to get talisman named: "${phaseName} ${talismanData.name}"`);

	const talisman = talismanModel.Clone() as Model;
	setAssetProperties("talisman", talisman);

	const primaryPart = talisman.PrimaryPart as BasePart;
	assert(primaryPart, `Failed to get primary part of talisman with id: "${talismanId}" of phase: "${phase}".`);

	const talismanAttachment = new Instance("Attachment", primaryPart);

	const alignPosition = new Instance("AlignPosition", primaryPart);
	alignPosition.Mode = Enum.PositionAlignmentMode.OneAttachment;
	alignPosition.MaxForce = 50000;
	alignPosition.Attachment0 = talismanAttachment;
	alignPosition.Responsiveness = 50;

	const alignOrientation = new Instance("AlignOrientation", primaryPart);
	alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	alignOrientation.Attachment0 = talismanAttachment;
	alignOrientation.Responsiveness = 80;

	const playersTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
	if (playersTalisman !== undefined) {
		playersTalisman.Destroy();
	}

	talisman.Name = player.Name;
	talisman.PivotTo(humanoidRootPart.CFrame);
	talisman.Parent = Workspace["client objects"].talismans;

	const talismanRender = RunService.RenderStepped.Connect(() => {
		if (humanoidRootPart !== undefined) {
			const hover = math.cos(os.clock() * 3) * 1;

			alignPosition.Position = humanoidRootPart.CFrame.mul(new CFrame(2, hover, 3)).Position;
			alignOrientation.CFrame = humanoidRootPart.CFrame;
		}
	});

	humanoid.Died.Connect(() => {
		talismanRender.Disconnect();

		const playersTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
		if (playersTalisman !== undefined) {
			playersTalisman.Destroy();
		}
	});
}
