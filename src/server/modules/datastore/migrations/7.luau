return function(state)
	state.worldPrestige = nil

	local bansState = state.bans
	state.bans = {
		bans = 0,
		allTimeBans = bansState,
	}
	return state
end
