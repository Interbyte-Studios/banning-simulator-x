// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { useMockPlayer } from "shared/mocks/player";

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

	const mockPlayer = useMockPlayer();

	const fireThread = task.spawn(() => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			fireFakeServerToClientRemote(fakeRemoteContext.receiveTradeRequest, mockPlayer);
			task.wait(1);
		}
	});

	return (): void => {
		cleanup();

		task.cancel(fireThread);
	};
};
