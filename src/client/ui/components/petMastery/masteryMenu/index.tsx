import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { WorldName } from "shared/configs/worlds";

import { IndexEggScroll } from "./indexUtil/eggScroll";
import { IndexEggView } from "./indexUtil/eggView";
import { PetMasteryIndexHeader } from "./indexUtil/header";

interface PetMasteryMenuProps {
	world: WorldName;
	hideMenu: () => void;
}

/**
 * Displays all the pets of a given world, and accolades for each one that give rewards.
 */
export const PetMasteryMenu = hooks((props: PetMasteryMenuProps, { useState }) => {
	const [eggToView, setEggToView] = useState<EggName | undefined>("Starter");

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.5, 0.61)}
			Image={assetIds.images.ui.index.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.3} />
			<PetMasteryIndexHeader />
			<IndexEggScroll
				world={props.world}
				displayEgg={(eggName: EggName | undefined): void => setEggToView(eggName)}
				currentEgg={eggToView}
			/>
			<IndexEggView egg={eggToView} hideInfo={(): void => setEggToView(undefined)} />
			<ExitButton
				Position={UDim2.fromScale(0.975, 0.075)}
				minimizedSize={0.075}
				maximizedSize={0.1}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
