import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { getRankProgress } from "client/util/getRankProgress";
import assetIds from "shared/assets";

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
	const rankProgress = getRankProgress(props.rank, props.experience);
	if (rankProgress !== 5) {
		return <></>;
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.85, 0.2)}
			Size={UDim2.fromScale(0.3, 0.3)}
			BackgroundColor3={Color3.fromRGB(250, 112, 112)}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(107, 33, 33) }} />
		</imagelabel>
	);
});

/* eslint-disable jsdoc/require-jsdoc */
export const UpgradeRankTeleport = hooks((props: UpgradeRankTeleportProps, { useEffect }) => {
	const minizmizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	const motor = new Flipper.SingleMotor(props.maximizedSize);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);

	useEffect(() => {
		return (): void => {
			motor.destroy();
		};
	}, []);

	return (
		<imagebutton
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			Position={props.position}
			Image={assetIds.images.ui.hud.upgrade}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					const character = player.Character;
					assert(character, `Failed to get Character for ${player.Name} while teleporting to rank upgrade zone`);

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					assert(humanoid, `Failed to get Humanoid for ${player.Name} while teleporting to the rank upgrade zone.`);

					const humanoidRootPart = humanoid.RootPart;
					assert(humanoidRootPart, `Failed to get HumanoidRootPart while teleporting to rank upgrade zone.`);

					humanoidRootPart.CFrame = new CFrame(Workspace.interactions.rankUpgrade.teleport.Position);
				},
				MouseEnter: (): void => motor.setGoal(minizmizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<UpgradeNotification rank={props.rank} experience={props.experience} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
