return function(state)
	-- change Secret to Prismatic
	local secrets = 0
	if state.eggs.rarities.Prismatic then
		secrets += state.eggs.rarities.Prismatic
		state.eggs.rarities.Prismatic = nil
	end
	state.eggs.rarities.Secret = secrets

	return state
end
