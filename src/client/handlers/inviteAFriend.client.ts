import { Players, SocialService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { remotes } from "shared/remotes";

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		debug.setmemorycategory("inviteAFriend");
		for (const prompt of Workspace.interactions.invites.interactions.GetChildren()) {
			if (!prompt.IsA("BasePart")) {
				continue;
			}

			const proximityPrompt = prompt.FindFirstChildOfClass("ProximityPrompt");
			if (proximityPrompt === undefined) {
				continue;
			}

			proximityPrompt.Triggered.Connect(() => {
				const [success, canSend] = pcall(() => {
					return SocialService.CanSendGameInviteAsync(player);
				});

				if (!success || !canSend) {
					return;
				}

				const [requestSuccess] = pcall(() => {
					SocialService.PromptGameInvite(player);
				});

				if (requestSuccess) {
					if (store.getState().invitedFriend) {
						return;
					}

					remotes.Client.Get("claimInvitedFriend").SendToServer();
				}
			});
		}
	})
	.catch((e) => {
		throw `[ Invite A Friend Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
