debug.setmemorycategory("followTalisman");
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { getHumanoidRootPart } from "client/util/getHumanoidRoot";
import { TalismanPhases } from "shared/configs/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

const talismansFolder = ReplicatedStorage.assetObjects.talismans;
const connections: Map<Player, Array<RBXScriptConnection>> = new Map();

/**
 * Equips a talisman to the player that follows them.
 *
 * @param player The local player.
 * @param talismanId The id of the talisman thats being equipped.
 * @param phase The phase of the talisman.
 */
export function equipTalisman(player: Player, talismanId: number, phase: TalismanPhases): void {
	const talismanData = getTalismanData(talismanId);
	const talismanFolder = talismansFolder.FindFirstChild(`Tier ${talismanData.id}`);
	if (talismanFolder === undefined) {
		return;
	}

	const phaseName = phase === "awakend" ? "Awakend" : phase === "artifact" ? "Artifact" : "normal";
	const talismanModel = talismanFolder.FindFirstChild(
		phaseName === "normal" ? talismanData.name : `${phaseName} ${talismanData.name}`,
	);
	if (talismanModel === undefined) {
		return;
	}

	const newTalisman = talismanModel.Clone() as Model;
	setAssetProperties("talisman", newTalisman);
	const primaryPart = newTalisman.PrimaryPart as BasePart;
	if (primaryPart === undefined) {
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

	const potentiallyActiveTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
	if (potentiallyActiveTalisman !== undefined) {
		potentiallyActiveTalisman.Destroy();
	}

	const character = player.Character;
	if (character === undefined) {
		return;
	}

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const humanoidRootPart = getHumanoidRootPart(player);
	if (humanoidRootPart === undefined) {
		return;
	}

	newTalisman.Name = player.Name;
	newTalisman.PivotTo(humanoidRootPart.CFrame);
	newTalisman.Parent = Workspace["client objects"].talismans;

	const talismanConnections = connections.get(player);
	if (talismanConnections !== undefined) {
		for (const connection of talismanConnections) {
			connection.Disconnect();
		}
	}
	connections.delete(player);
	connections.set(player, [
		RunService.RenderStepped.Connect(() => {
			debug.profilebegin("talismanRender");
			const humanoidRootPart = getHumanoidRootPart(player);
			if (humanoidRootPart === undefined) {
				return;
			}

			const talismanPrimary = newTalisman.PrimaryPart as BasePart;
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
		}),
		humanoid.Died.Connect(() => {
			const potentiallyActiveTalisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
			if (potentiallyActiveTalisman !== undefined) {
				potentiallyActiveTalisman.Destroy();
			}
		}),
	]);
}
