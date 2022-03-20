import Roact from "@rbxts/roact";
import Rodux from "@rbxts/rodux";
import { useMockPlayer } from "shared/mocks/player";
import { storeReducer } from "shared/rodux";

import { app as App } from "../app";

export = (target: GuiBase): (() => void) => {
	const store = new Rodux.Store(storeReducer);

	const app = <App player={useMockPlayer()} store={store} />;

	const handle = Roact.mount(app, target);

	return () => {
		Roact.unmount(handle);
		store.destruct();
	};
};
