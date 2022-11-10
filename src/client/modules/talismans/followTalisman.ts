import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { TALISMAN_PHASES } from "shared/configs/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

const talismansFolder = ReplicatedStorage.assetObjects.talismans;

/**
 * Equips a talisman to the player that follows them.
 *
 * @param player The local player.
 * @param talismanId The id of the talisman thats being equipped.
 * @param bans The number of bans the talisman has.
 */
export function equipTalisman(player: Player, talismanId: number, bans: number): void {
	const character = player.Character;
	assert(character, `Failed to get character for ${player.Name}. Cannot animate talisman.`);

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	assert(humanoid, `Failed to get Humanoid for ${player.Name}. Cannot animate talisman.`);

	const humanoidRootPart = humanoid.RootPart;
	assert(humanoidRootPart, `Failed to get HumanoidRootPart for ${player.Name}. Cannot animate talisman.`);

	const talismanData = getTalismanData(talismanId);
	const talismanPhase = TALISMAN_PHASES.find((phase) => phase.requiredBans >= bans);
	assert(talismanPhase, `Could not get talisman phase for ${bans} bans`);

	const talismanFolder = talismansFolder.FindFirstChild(`Tier ${talismanData.id}`);
	assert(talismanFolder, `Failed to get talisman folder for talisman tier ${talismanData.id}`);

	const phaseName =
		talismanPhase.phase === "awakend" ? "Awakened" : talismanPhase.phase === "artifact" ? "Artifact" : "";
	const talismanModel = talismanFolder.FindFirstChild(
		talismanPhase.phase === "normal" ? talismanData.name : `${phaseName} ${talismanData.name}`,
	);
	assert(talismanModel, `Failed to get talisman named: "${phaseName} ${talismanData.name}"`);

	const talisman = talismanModel.Clone() as Model;
	setAssetProperties("talisman", talisman);

	const talismanAttachment = new Instance("Attachment", talisman.PrimaryPart);

	const alignPosition = new Instance("AlignPosition", talisman.PrimaryPart);
	alignPosition.Mode = Enum.PositionAlignmentMode.OneAttachment;
	alignPosition.MaxForce = 50000;
	alignPosition.Attachment0 = talismanAttachment;
	alignPosition.Responsiveness = 50;

	const alignOrientation = new Instance("AlignOrientation", talisman.PrimaryPart);
	alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	alignOrientation.Attachment0 = talismanAttachment;
	alignOrientation.Responsiveness = 80;

	const playersTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
	if (playersTalisman !== undefined) {
		playersTalisman.Destroy();
	}

	talisman.Name = player.Name;
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
