import { ProfileState } from "server/modules/datastore/profile";
import { StoreState } from "shared/rodux";
import { deserializeBoosts, serializeBoosts } from "shared/rodux/boosts";

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
			pets: store.index.pets,
			vipRewards: {
				...store.index.vipRewards,
				lastClaimed: store.index.vipRewards.lastClaimed.UnixTimestampMillis,
			},
		},
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
			vipRewards: {
				...state.index.vipRewards,
				lastClaimed: DateTime.fromUnixTimestampMillis(state.index.vipRewards.lastClaimed),
			},
		},
		tradeLogs: state.tradeLogs.map((log) => {
			return {
				...log,
				timestamp: DateTime.fromUnixTimestampMillis(log.timestamp),
			};
		}),
	};
}
