import { remotes } from "shared/remotes";

import { stores } from "../clientStores";

remotes.Client.GetNamespace("rodux")
	.Get("storeChange")
	.Connect((player, action) => {
		const store = stores.get(player);
		store?.dispatch(action);
	});
