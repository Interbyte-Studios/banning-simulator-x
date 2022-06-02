import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { EGGS } from "shared/configs/eggs";
import { Store } from "shared/rodux";

import { eggHudAnimatorService } from "./eggHudAnimatorService";
import { EggHudDisplay } from "./eggHudDisplay";

interface EggHudProps {
	store: Store;
}

/* eslint-disable jsdoc/require-jsdoc */
export function EggHud(props: EggHudProps): Roact.Element {
	eggHudAnimatorService.init();

	return (
		<frame Visible={false}>
			{Object.entries(EGGS).map(([eggName, eggData]) => {
				const eggFolder = Workspace.interactions.eggs[eggName];

				const regularEgg = eggFolder.regular.egg.PrimaryPart;
				assert(regularEgg, `Expected PrimaryPart for regular ${eggName} egg`);

				const voidEgg = eggFolder.void.egg.PrimaryPart;
				assert(voidEgg, `Expected PrimaryPart for void ${eggName} egg`);

				return (
					<frame Visible={false}>
						<EggHudDisplay
							adornee={regularEgg}
							eggName={eggName}
							isVoid={false}
							pets={eggData.pets}
							store={props.store}
						/>
						<EggHudDisplay adornee={voidEgg} eggName={eggName} isVoid={true} pets={eggData.pets} store={props.store} />
					</frame>
				);
			})}
		</frame>
	);
}
