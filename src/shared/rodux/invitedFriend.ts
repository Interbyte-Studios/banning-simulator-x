import Rodux from "@rbxts/rodux";

export type InvitedFriendActions = ClaimInvitedFriend;
export type InvitedFriendState = boolean;
export const defaultInvitedFriendState: InvitedFriendState = false;

interface ClaimInvitedFriend extends Rodux.Action<"claimInvitedFriend"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function claimInvitedFriend(): ClaimInvitedFriend & Rodux.AnyAction {
	return {
		type: "claimInvitedFriend",
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const invitedFriendReducer = Rodux.createReducer<InvitedFriendState, InvitedFriendActions>(
	defaultInvitedFriendState,
	{
		claimInvitedFriend: () => {
			return true;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
