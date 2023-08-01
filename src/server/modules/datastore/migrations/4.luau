return function(state)
	-- Add new stat for storing the highest wave achieved on hard mode difficulty in time trials
	if state.timeTrials then
		state.timeTrials["Ban Land"] = {
			health = state.timeTrials["Ban Land"].health,
			damage = state.timeTrials["Ban Land"].damage,
			damageReduction = state.timeTrials["Ban Land"].damageReduction,
			criticalChance = state.timeTrials["Ban Land"].criticalChance,
			highestHardWave = 0,
		}
	else
		state.timeTrials = {}
		state.timeTrials = {
			["Ban Land"] = {
				health = 0,
				damage = 0,
				damageReduction = 0,
				criticalChance = 0,
				highestHardWave = 0,
			},
		}
	end

	-- Separate purchased and daily spins
	state.spinWheel.purchasedSpinsAvailable = 0
	if state.spinWheel.spinsAvailable > 1 then
		state.spinWheel.purchasedSpinsAvailable += state.spinWheel.spinsAvailable - 1
		state.spinWheel.spinsAvailable = 1
	end

	return state
end
