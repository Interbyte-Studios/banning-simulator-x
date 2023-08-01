debug.setmemorycategory("followTalisman");
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { getHumanoidRootPart } from "client/util/getHumanoidRoot";
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
	const character = player.Character ?? player.CharacterAdded.Wait()[0];
	if (character === undefined) {
		warn(`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. Character is undefined.`);
		return;
	}

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	if (humanoid === undefined) {
		warn(`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. Humanoid is undefined.`);
		return;
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		warn(`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. HumanoidRootPart is undefined.`);
		return;
	}

	const talismanData = getTalismanData(talismanId);

	const talismanFolder = talismansFolder.FindFirstChild(`Tier ${talismanData.id}`);
	if (talismanFolder === undefined) {
		warn(`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. Talisman folder is undefined.`);
		return;
	}

	const phaseName = phase === "awakend" ? "Awakend" : phase === "artifact" ? "Artifact" : "normal";
	const talismanModel = talismanFolder.FindFirstChild(
		phaseName === "normal" ? talismanData.name : `${phaseName} ${talismanData.name}`,
	);
	if (talismanModel === undefined) {
		warn(
			`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. Talisman model ${talismanData.name} of variant ${phaseName} is undefined.`,
		);
		return;
	}

	const talisman = talismanModel.Clone() as Model;
	setAssetProperties("talisman", talisman);

	const primaryPart = talisman.PrimaryPart as BasePart;
	if (primaryPart === undefined) {
		warn(`[Talisman Animator] - Failed to animate talisman for player ${player.Name}. PrimaryPart is undefined.`);
		return;
	}

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
		debug.profilebegin("talismanRender");
		const humanoidRootPart = getHumanoidRootPart(player);
		if (humanoidRootPart === undefined) {
			return;
		}

		const talismanPrimary = talisman.PrimaryPart as BasePart;
		if (talismanPrimary === undefined) {
			return;
		}

		if (humanoidRootPart.Position.sub(talismanPrimary.Position).Magnitude > 100) {
			talismanPrimary.CFrame = new CFrame(humanoidRootPart.Position);
		}

		const hover = math.cos(os.clock() * 3) * 1;

		alignPosition.Position = humanoidRootPart.CFrame.mul(new CFrame(2, hover, 3)).Position;
		alignOrientation.CFrame = humanoidRootPart.CFrame;
		debug.profileend();
	});

	humanoid.Died.Connect(() => {
		talismanRender.Disconnect();

		const playersTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
		if (playersTalisman !== undefined) {
			playersTalisman.Destroy();
		}
	});
}
