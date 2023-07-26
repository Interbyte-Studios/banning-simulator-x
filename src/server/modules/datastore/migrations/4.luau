return function(state)
	-- get rid of old data that isn't used
	state.timeTrials["Ban Land"].highestHardWave = nil

	return state
end
