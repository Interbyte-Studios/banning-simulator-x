return function(state)
	-- Add new stat for storing the highest wave achieved on hard mode difficulty in time trials
	state.timeTrials["Ban Land"].highestHardWave = 0

	-- Separate purchased and daily spins
	state.spinWheel.purchasedSpinsAvailable = 0
	if state.spinWheel.spinsAvailable > 1 then
		state.spinWheel.purchasedSpinsAvailable += state.spinWheel.spinsAvailable - 1
		state.spinWheel.spinsAvailable = 1
	end

	return state
end
