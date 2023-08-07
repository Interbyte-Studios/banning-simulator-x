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

	if state.worldPrestige and not state.worldPrestige["Cyber Cities"] then
		state.worldPrestige["Cyber Cities"] = {
			currencyUpgrades = 0,
			additionalPetsUpgrades = 0,
			reducedVoidEggCostUpgrades = 0,
			reducedFusionCostUpgrades = 0,
			currentPrestige = 0,
			prestigeTokens = 0,
		}
	else
		local defaultWorldPrestige = {
			currencyUpgrades = 0,
			additionalPetsUpgrades = 0,
			reducedVoidEggCostUpgrades = 0,
			reducedFusionCostUpgrades = 0,
			currentPrestige = 0,
			prestigeTokens = 0,
		}

		state.worldPrestige = {
			["Ban Land"] = defaultWorldPrestige,
			["Cyber Cities"] = defaultWorldPrestige,
		}
	end
	return state
end
