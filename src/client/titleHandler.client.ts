import { Players, TextChatService } from "@rbxts/services";
import { TITLES } from "shared/configs/titles";

import { stores } from "./clientStores";

/**
 * Triggers whenever a message is about to be sent in the chat.
 *
 * @param message The message that is being sent.
 * @returns The `TextChatMessageProperties` to apply, or `undefined` if the default should be used.
 */
TextChatService.OnIncomingMessage = (message): TextChatMessageProperties | undefined => {
	if (message.TextSource === undefined) {
		return;
	}

	const player = Players.GetPlayerByUserId(message.TextSource.UserId);
	if (player === undefined) {
		return;
	}

	// get player store
	const store = stores.get(player);
	if (!store) {
		return;
	}

	// get player title
	const title = TITLES.find((title) => title.name === store.getState().title);
	if (!title) {
		return;
	}

	// apply color to the chat
	const properties = new Instance("TextChatMessageProperties");
	properties.Text = `<font color="#${title.effect.ToHex()}">${message.Text}</font>`;

	return properties;
};
