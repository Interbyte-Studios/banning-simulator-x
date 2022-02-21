import Rodux from "@rbxts/rodux";

export type StoreActions = Rodux.AnyAction;
export type StoreState = unknown;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({});

export type Store = Rodux.Store<StoreState, StoreActions>;
