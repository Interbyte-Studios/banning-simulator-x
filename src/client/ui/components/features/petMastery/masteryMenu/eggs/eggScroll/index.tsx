import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { EggName, EGGS } from "shared/configs/eggs";
import { WorldName } from "shared/configs/worlds";

import { IndexEggCard } from "./eggCard";

/**
 * A scroll menu displaying all hatchable eggs in the world the player is viewing in the pet mastery component.
 *
 * @param props The properties of the Roact component.
 * @param props.world The world that pet mastery is being viewed in.
 * @param props.displayEgg A function to display the egg's info in the view area of the component.
 * @param props.currentEgg The egg currently being displayed.
 * @returns A Roact component.
 */
export function IndexEggScroll(props: {
	world: WorldName;
	currentEgg: EggName | undefined;
	displayEgg: (eggName: EggName | undefined) => void;
}): Roact.Element {
	const eggs = Object.entries(EGGS).filter((egg) => egg[1].world === props.world);

	return (
		<BaseFrame Position={UDim2.fromScale(0.225, 0.55)} Size={UDim2.fromScale(0.4, 0.775)}>
			<uilistlayout
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				Padding={new UDim(0.05, 0)}
			/>
			{eggs.map((eggData) => {
				if (eggData[0] === "500k Event") {
					return <></>;
				}

				return (
					<IndexEggCard
						egg={eggData[0]}
						layoutOrder={eggData[1].id}
						displayEgg={props.displayEgg}
						currentEgg={props.currentEgg}
					/>
				);
			})}
		</BaseFrame>
	);
}
