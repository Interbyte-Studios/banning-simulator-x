import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, PolicyService } from "@rbxts/services";
import { getIsTrading } from "client/modules/isTradingCache";
import { getLastHatch, setLastHatch } from "client/modules/lastHatch";
import { udim2BottomRight } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { EggName, hatchDebounce } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { EggsState } from "shared/rodux/eggs";
import { GamepassesState } from "shared/rodux/gamepasses";
import { ConfirmedPet, PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { hooks } from "../../hooks";
import { EggCost } from "./eggCosts";
import { EggHatch } from "./eggHatch";
import { AnimateEggs } from "./eggHatch/animateEggs";
import { EggHud } from "./eggHud";

interface EggsUIProps extends EggsUIMappedProps {
	visible: boolean;
	setHatchingStatus: (isHatching: boolean) => void;
}

interface EggsUIMappedProps {
	worlds: WorldsState;
	pets: PetsState;
	gamepasses: GamepassesState;
	currencies: CurrenciesState;
	eggs: EggsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggsUIMappedProps {
	return {
		worlds: state.worlds,
		pets: state.pets,
		gamepasses: state.gamepasses,
		currencies: state.currencies,
		eggs: state.eggs,
	};
}

interface HatchData {
	eggName: EggName;
	pets: Array<ConfirmedPet>;
	isVoid: boolean;
}

const player = Players.LocalPlayer;

/**
 * A higher ordered component that displays both information for all the eggs in the game and functionality to hatch those eggs.
 */
export const EggsUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggsUIProps, { useState, useContext, useEffect, useValue }) => {
		const [regionalRegulationsEnforced, setReguionalRegulationsForced] = useState(false);

		if (!props.visible) {
			return <></>;
		}

		const [currentHatchData, setCurrentHatchData] = useState<HatchData | undefined>(undefined);

		const { hatchEgg } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		useEffect(() => {
			const playerRegionalRegulations = PolicyService.GetPolicyInfoForPlayerAsync(player);
			setReguionalRegulationsForced(playerRegionalRegulations.ArePaidRandomItemsRestricted);
		}, []);

		const componentProps = useValue(props);
		useEffect(() => {
			componentProps.value = props;
		}, [props]);

		/**
		 * Initiates the hatching process.
		 *
		 * @param amount The amount of eggs to hatch.
		 * @param egg The egg to hatch.
		 * @param isVoid Whether or not the egg is a void egg.
		 */
		const initiateHatch = async (amount: 1 | 2 | 3, egg: EggName, isVoid: boolean): Promise<void> => {
			// verify that player has waited long enough to hatch
			const now = time();
			const canHatch = now - getLastHatch() > hatchDebounce;
			if (!canHatch) {
				return;
			}
			setLastHatch(now);

			const properties = componentProps.value;

			// make sure they aren't trading
			if (getIsTrading()) {
				addAnnouncement(`You cannot hatch while you're trading.`, AnnouncementType.Error);
				return;
			}

			// verify that the user can hatch the eggs
			const eggData = getEggData(egg);

			const eggMasteryReducedMultiplier = getEggsMastery(properties.eggs).reducedEggCostMultiplier;
			const eggCost = getEggCost(egg, isVoid, eggMasteryReducedMultiplier);

			// check that user owns world
			const ownsWorld = properties.worlds.find((x) => x.name === eggData.world);
			if (ownsWorld === undefined) {
				addAnnouncement(`You don't own the world this egg is in!`, AnnouncementType.Error);
				return;
			}

			// check that user owns zone
			const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
			if (ownsZone === undefined) {
				addAnnouncement(`You don't own the zone this egg is in!`, AnnouncementType.Error);
				return;
			}

			// check for currency
			if (eggCost.amount * amount > properties.currencies[eggCost.currencyType]) {
				addAnnouncement(`You don't have enough ${eggCost.currencyType} to hatch this egg!`, AnnouncementType.Error);
				return;
			}

			// check inventory space
			if (properties.pets.size() >= getPetInventorySize(properties.gamepasses) + amount) {
				addAnnouncement(`You don't have enough inventory space to hatch this egg!`, AnnouncementType.Error);
				return;
			}

			// check that user is within distance
			const character = player.Character;
			if (character === undefined) {
				addAnnouncement(`There was an error hatching your egg. Please try again.`, AnnouncementType.Error);
				return;
			}

			const isWithinDistance = withinDistanceToHatch(character, egg, isVoid);
			// eslint-disable-next-line roblox-ts/lua-truthiness
			if (!isWithinDistance) {
				addAnnouncement(`You are not close enough to hatch this egg!`, AnnouncementType.Error);
				return;
			}
		};

		const children = (
			<>
				<EggCost />
				<EggHud
					initiateHatch={async (amount: 1 | 2 | 3, egg: EggName, isVoid: boolean): Promise<void> => {
						// make sure their region (country) allows them to hatch eggs!
						if (regionalRegulationsEnforced) {
							addAnnouncement(`Hatching pets is regulated by your country. Sorry!`, AnnouncementType.Error);
							return;
						}

						await initiateHatch(amount, egg, isVoid);

						const requestEggHatch = await hatchEgg.CallServerAsync(amount, egg, isVoid);
						if (requestEggHatch.success) {
							props.setHatchingStatus(true);
							AnimateEggs.handleAnimation();
							AnimateEggs.initiateEggHatch({
								amount,
								eggName: egg,
								isVoid,
								fastEnabled: props.gamepasses["Fast Hatch"],
							});

							warn(`[1] Setting current hatch data`);
							setCurrentHatchData({
								eggName: egg,
								pets: requestEggHatch.pets,
								isVoid,
							});
							warn(`[1.5] Current hatch data set`);

							AnimateEggs.initiatePetHatch({
								amount,
								eggName: egg,
								pets: requestEggHatch.pets,
								isVoid,
								fastEnabled: props.gamepasses["Fast Hatch"],
							});

							warn(`[6] Refreshing current hatch data`);
							setCurrentHatchData({
								eggName: egg,
								pets: requestEggHatch.pets,
								isVoid,
							});
							warn(`[6.5] Refreshed current hatch data`);
						} else {
							addAnnouncement(
								`An issue has occured while hatching. You might not have enough currency.`,
								AnnouncementType.Error,
							);
							setCurrentHatchData(undefined);
						}
					}}
				/>
				{currentHatchData !== undefined ? (
					<EggHatch eggName={currentHatchData.eggName} isVoid={currentHatchData.isVoid} pets={currentHatchData.pets} />
				) : undefined}
			</>
		);

		warn(`[2] currentHatchData: ${currentHatchData}`);

		return <BaseFrame Size={udim2BottomRight}>{children}</BaseFrame>;
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
