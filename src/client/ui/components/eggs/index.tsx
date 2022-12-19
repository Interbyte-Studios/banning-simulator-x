import Roact from "@rbxts/roact";
import { Players, PolicyService } from "@rbxts/services";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { EggName, hatchDebounce } from "shared/configs/eggs";
import { Store } from "shared/rodux";
import { ConfirmedPet } from "shared/rodux/pets";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { hooks } from "../../hooks";
import { EggCost } from "./eggCosts";
import { EggHatch } from "./eggHatch";
import { AnimateEggs } from "./eggHatch/animateEggs";
import { EggHud } from "./eggHud";

interface EggsUIProps {
	store: Store;
	visible: boolean;
	setHatchingStatus: (isHatching: boolean) => void;
}

interface HatchData {
	eggName: EggName;
	pets: Array<ConfirmedPet>;
	isVoid: boolean;
}

const player = Players.LocalPlayer;
const hatchTimeCache: Map<Player, number> = new Map();

/**
 * A higher ordered component that displays both information for all the eggs in the game and functionality to hatch those eggs.
 */
export const EggsUI = hooks((props: EggsUIProps, { useState, useContext, useEffect }) => {
	const [regionalRegulationsEnforced, setReguionalRegulationsForced] = useState(false);

	if (!props.visible) {
		return <></>;
	}

	const [currentHatchData, setCurrentHatchData] = useState<HatchData | undefined>(undefined);

	const { hatchEgg } = useContext(remoteContext);
	const { addError } = useContext(AnnouncementContext);

	useEffect(() => {
		const playerRegionalRegulations = PolicyService.GetPolicyInfoForPlayerAsync(player);
		setReguionalRegulationsForced(playerRegionalRegulations.ArePaidRandomItemsRestricted);
	}, []);

	const children = [
		<EggCost />,
		<EggHud
			initiateHatch={async (amount: 1 | 2 | 3, egg: EggName, isVoid: boolean): Promise<void> => {
				if (regionalRegulationsEnforced) {
					addError(`Hatching pets is regulated by your country. Sorry!`);
					return;
				}

				// verify that player has waited long enough to hatch
				const lastHatchTime = hatchTimeCache.get(player) ?? 0;

				const now = time();
				const canHatch = now - lastHatchTime > hatchDebounce;
				if (!canHatch) {
					return;
				}

				// verify that the user can hatch the eggs
				const currentState = props.store.getState();
				const eggData = getEggData(egg);
				const eggCost = getEggCost(egg, isVoid);

				// check that user owns world
				const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
				if (ownsWorld === undefined) {
					return;
				}

				// check that user owns zone
				const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
				if (ownsZone === undefined) {
					return;
				}

				// check for currency
				if (eggCost.amount * amount > currentState.currencies[eggCost.currencyType]) {
					return;
				}

				// check inventory space
				if (currentState.pets.size() >= getPetInventorySize(currentState.gamepasses) + amount) {
					return;
				}

				// check that user is within distance
				const character = player.Character;
				if (character === undefined) {
					return;
				}

				const isWithinDistance = withinDistanceToHatch(character, egg, isVoid);
				// eslint-disable-next-line roblox-ts/lua-truthiness
				if (!isWithinDistance) {
					return;
				}

				const requestEggHatch = await hatchEgg.CallServerAsync(amount, egg, isVoid);

				if (requestEggHatch.success) {
					props.setHatchingStatus(true);
					AnimateEggs.handleAnimation();
					AnimateEggs.initiateEggHatch({
						amount,
						eggName: egg,
						isVoid,
						fastEnabled: currentState.gamepasses["Fast Hatch"],
					});

					setCurrentHatchData({
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
					});

					AnimateEggs.initiatePetHatch({
						amount,
						eggName: egg,
						pets: requestEggHatch.pets,
						isVoid,
						fastEnabled: currentState.gamepasses["Fast Hatch"],
					});

					setCurrentHatchData(undefined);
					props.setHatchingStatus(false);
				} else {
					setCurrentHatchData(undefined);
				}
			}}
		/>,
	];

	if (currentHatchData) {
		children.push(
			<EggHatch eggName={currentHatchData.eggName} isVoid={currentHatchData.isVoid} pets={currentHatchData.pets} />,
		);
	}

	return (
		<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
			{children}
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
