return function(state)
	-- get rid of old data that isn't used
	state.spinWheel.startTime = nil
	state.spinWheel.endTime = nil
	state.spinWheel.dayEndTime = nil
	state.spinWheel.spinsDone = nil

	-- add new wheel spin data
	state.spinWheel.totalSpins = 0
	state.spinWheel.spinsAvailable = 0
	state.spinWheel.lastSpinTime = 0

	return state
end
