import { StoreState } from "shared/rodux";
import { defaultAccoladeState } from "shared/rodux/accolade";
import { defaultBansState } from "shared/rodux/bans";
import { defaultBoosts, deserializeBoosts, serializeBoosts, SerializedBoostsState } from "shared/rodux/boosts";
import { defaultCurrencies } from "shared/rodux/currencies";
import { defaultTalismanId } from "shared/rodux/currentTalisman";
import { defaultCurrentWeaponState } from "shared/rodux/currentWeapon";
import { defaultDevProductState } from "shared/rodux/devProducts";
import { defaultEggs } from "shared/rodux/eggs";
import { defaultExperienceState } from "shared/rodux/experience";
import { defaultGamepasses } from "shared/rodux/gamepasses";
import { defaultMediaState } from "shared/rodux/media";
import { deserializePetMastery, SerializedPetMasteryState, serializePetMastery } from "shared/rodux/petMastery";
import { defaultPets } from "shared/rodux/pets";
import { defaultPetTeamsState } from "shared/rodux/petTeams";
import { defaultPlayerIndexState } from "shared/rodux/playerIndex";
import {
	deserializePetIndexState,
	SerializedPetIndexState,
	serializePetIndexState,
} from "shared/rodux/playerIndex/pets";
import { defaultQuestsState } from "shared/rodux/quests";
import { defaultRank } from "shared/rodux/rank";
import { defaultSettings } from "shared/rodux/settings";
import { defaultSpinWheel } from "shared/rodux/spinWheel";
import { defaultTalismans } from "shared/rodux/talismans";
import { SerializedTradeLogState } from "shared/rodux/tradeLogs";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorlds } from "shared/rodux/worlds";
import { Modify } from "shared/util/modify";

export type ProfileState = Modify<
	StoreState,
	{
		boosts: SerializedBoostsState;
		index: Modify<
			StoreState["index"],
			{
				clubRewards: Modify<
					StoreState["index"]["clubRewards"],
					{
						lastClaimed: number;
					}
				>;
				groupRewards: Modify<
					StoreState["index"]["groupRewards"],
					{
						lastClaimed: number;
					}
				>;
				joinDate: number;
				pets: SerializedPetIndexState;
				vipRewards: Modify<
					StoreState["index"]["vipRewards"],
					{
						lastClaimed: number;
					}
				>;
			}
		>;
		petMastery: SerializedPetMasteryState;
		tradeLogs: SerializedTradeLogState;
	}
>;

/**
 * Profile template matches the store state template.
 */
export const profileTemplate: ProfileState = {
	accolades: defaultAccoladeState,
	bans: defaultBansState,
	boosts: defaultBoosts,
	currencies: defaultCurrencies,
	currentWeapon: defaultCurrentWeaponState,
	currentTalisman: defaultTalismanId,
	devProducts: defaultDevProductState,
	eggs: defaultEggs,
	experience: defaultExperienceState,
	gamepasses: defaultGamepasses,
	index: {
		...defaultPlayerIndexState,
		clubRewards: {
			...defaultPlayerIndexState["clubRewards"],
			lastClaimed: 0,
		},
		groupRewards: {
			...defaultPlayerIndexState["groupRewards"],
			lastClaimed: 0,
		},
		pets: [],
		joinDate: DateTime.now().UnixTimestampMillis,
		vipRewards: {
			...defaultPlayerIndexState["vipRewards"],
			lastClaimed: 0,
		},
	},
	media: defaultMediaState,
	pets: defaultPets,
	petMastery: [],
	petTeams: defaultPetTeamsState,
	quests: defaultQuestsState,
	rank: defaultRank,
	settings: defaultSettings,
	spinWheel: defaultSpinWheel,
	talismans: defaultTalismans,
	title: undefined,
	tradeLogs: [],
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
	dataVersion: 1,
};

/**
 * Serializes a Rodux store state to be saved in a DataStore.
 *
 * @param store The store to serialize.
 * @returns The serialized store, ready to be saved in a DataStore.
 */
export function serialize(store: StoreState): ProfileState {
	return {
		...store,
		boosts: serializeBoosts(store.boosts),
		index: {
			...store.index,
			clubRewards: {
				...store.index.clubRewards,
				lastClaimed: store.index.clubRewards.lastClaimed.UnixTimestampMillis,
			},
			groupRewards: {
				...store.index.groupRewards,
				lastClaimed: store.index.groupRewards.lastClaimed.UnixTimestampMillis,
			},
			joinDate: store.index.joinDate.UnixTimestampMillis,
			pets: serializePetIndexState(store.index.pets),
			vipRewards: {
				...store.index.vipRewards,
				lastClaimed: store.index.vipRewards.lastClaimed.UnixTimestampMillis,
			},
		},
		petMastery: serializePetMastery(store.petMastery),
		tradeLogs: store.tradeLogs.map((log) => {
			return {
				...log,
				timestamp: log.timestamp.UnixTimestampMillis,
			};
		}),
	};
}

/**
 * Deserializes a profile state into a Rodux store state.
 *
 * @param state The state to deserialize.
 * @returns The reconstructed Rodux state.
 */
export function deserialize(state: ProfileState): StoreState {
	return {
		...state,
		boosts: deserializeBoosts(state.boosts),
		index: {
			...state.index,
			clubRewards: {
				...state.index.clubRewards,
				lastClaimed: DateTime.fromUnixTimestampMillis(state.index.clubRewards.lastClaimed),
			},
			groupRewards: {
				...state.index.groupRewards,
				lastClaimed: DateTime.fromUnixTimestampMillis(state.index.groupRewards.lastClaimed),
			},
			joinDate: DateTime.fromUnixTimestampMillis(state.index.joinDate),
			pets: deserializePetIndexState(state.index.pets),
			vipRewards: {
				...state.index.vipRewards,
				lastClaimed: DateTime.fromUnixTimestampMillis(state.index.vipRewards.lastClaimed),
			},
		},
		petMastery: deserializePetMastery(state.petMastery),
		tradeLogs: state.tradeLogs.map((log) => {
			return {
				...log,
				timestamp: DateTime.fromUnixTimestampMillis(log.timestamp),
			};
		}),
	};
}
