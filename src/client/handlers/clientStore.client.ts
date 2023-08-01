import { remotes } from "shared/remotes";

import { stores } from "../clientStores";

remotes.Client.GetNamespace("rodux")
	.Get("storeChange")
	.Connect((player, action) => {
		debug.setmemorycategory("clientStore");
		const store = stores.get(player);
		store?.dispatch(action);
	});
