return function(state)
	state.accolades = {}
	state.settings.gameplay.manualFighting = true
	state.currencies["cyber tokens"] = 0

	if state.timeTrials then
		state.timeTrials["Cyber Cities"] = nil
		state.timeTrials["Cyber Cities"] = {
			health = 0,
			damage = 0,
			damageReduction = 0,
			criticalChance = 0,
			highestHardWave = 0,
		}
	else
		local defaultTimeTrial = {
			health = 0,
			damage = 0,
			damageReduction = 0,
			criticalChance = 0,
			highestHardWave = 0,
		}

		state.timeTrials = {
			["Ban Land"] = defaultTimeTrial,
			["Cyber Cities"] = defaultTimeTrial,
		}
	end
	return state
end
