import Roact from "@rbxts/roact";

import { TextLabel } from "../elements/baseElements/textlabels/textlabel";
import { hooks } from "../hooks";
import { fakeRemoteContext, remoteContext } from "../mocks/remoteContext";
import { fireFakeServerToClientRemote } from "../mocks/remoteContext/fakeServerToClientRemote";
import { createMockStory } from "./createMockStory";

const Component = hooks((_, { useContext, useEffect }) => {
	const remote = useContext(remoteContext).receiveTradeRequest;

	const remoteConnection = remote.Connect(() => {
		print("received remote from the server!!");
	});

	useEffect(() => {
		return (): void => {
			remoteConnection.Disconnect();
		};
	}, []);

	return <TextLabel native={{ Text: "Hello World!!" }} />;
});

export = (target: Frame): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => {
		return <Component />;
	});

	const fireThread = task.spawn(() => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			fireFakeServerToClientRemote(fakeRemoteContext.receiveTradeRequest);
			task.wait(1);
		}
	});

	return (): void => {
		cleanup();

		task.cancel(fireThread);
	};
};
