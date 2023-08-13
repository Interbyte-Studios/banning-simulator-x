return function(state)
	state.rebirths = {
		rebirth = 0,
		magicEggUpgrades = 0,
		additionalEggs = 0,
		additionalPets = 0,
		currencyMultipliers = {
			coins = 0,
			gears = 0,
			["cyber tokens"] = 0,
			gems = 0,
		},
		teleport = false,
		fastHatch = false,
		extraLuck = false,
	}
	return state
end
