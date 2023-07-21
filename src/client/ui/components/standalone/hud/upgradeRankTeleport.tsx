import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TELEPORTATIONS } from "shared/configs/game";
import { MAX_RANK, RANKS } from "shared/configs/ranks";

const player = Players.LocalPlayer;

interface UpgradeRankTeleportProps {
	position: UDim2;
	minimizedSize: number;
	maximizedSize: number;
	rank: number;
	experience: number;
}

type NonImmuneProps = "position" | "minimizedSize" | "maximizedSize";
type UpgradeNotificationProps = Omit<UpgradeRankTeleportProps, NonImmuneProps>;

export const UpgradeNotification = hooks((props: UpgradeNotificationProps) => {
	const nextRank = props.rank + 1 <= MAX_RANK ? props.rank + 1 : MAX_RANK;

	const rankData = RANKS.find((rank) => rank.id === nextRank);
	assert(rankData, `Failed to get data for rank of id: "${nextRank}".`);

	const progress = props.experience < rankData.requiredExperience ? props.experience / rankData.requiredExperience : 1;
	const shouldDisplay = nextRank !== MAX_RANK ? (progress === 1 ? true : false) : false;

	if (!shouldDisplay) {
		return <></>;
	}

	return (
		<ImageLabel
			native={{
				BackgroundTransparency: 0,
				Position: UDim2.fromScale(0.85, 0.2),
				Size: UDim2.fromScale(0.3, 0.3),
				BackgroundColor3: Color3.fromRGB(250, 112, 112),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(107, 33, 33) }} />
		</ImageLabel>
	);
});

/* eslint-disable jsdoc/require-jsdoc */
export const UpgradeRankTeleport = hooks((props: UpgradeRankTeleportProps) => {
	return (
		<SpringImageButton
			native={{
				Position: props.position,
				Image: assetIds.images.ui.hud.upgrade,
			}}
			size={{
				maxSize: props.maximizedSize,
				minSize: props.minimizedSize,
			}}
			events={{
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MinorEngagement);

					const character = player.Character;
					assert(character, `Failed to get Character for ${player.Name} while teleporting to rank upgrade zone`);

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					assert(humanoid, `Failed to get Humanoid for ${player.Name} while teleporting to the rank upgrade zone.`);

					const humanoidRootPart = humanoid.RootPart;
					assert(humanoidRootPart, `Failed to get HumanoidRootPart while teleporting to rank upgrade zone.`);

					const rankTeleport = Workspace.interactions.rankUpgrade.teleport;
					if (rankTeleport === undefined) {
						player.RequestStreamAroundAsync(TELEPORTATIONS.ZONES.Forest);
						humanoidRootPart.CFrame = new CFrame(TELEPORTATIONS.ZONES.Forest);
						return;
					}

					humanoidRootPart.CFrame = new CFrame(rankTeleport.Position);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<UpgradeNotification rank={props.rank} experience={props.experience} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
