-- ran for the migration from release -> update 1
return function(state)
	-- convert pet mastery state into array format
	-- from 9d7bb9b2144b5d08b900a6c1f4ec1e62e26955e1
	local newMastery = {}
	for stringPetId, value in state.petMastery do
		value["petId"] = tonumber(stringPetId)
		table.insert(newMastery, value)
	end
	state.petMastery = newMastery

	-- convert player index over to new format (changes from 368a8a5b18514144d2ab4374e5edacef0ecdf58a)
	-- first convert timestamps to unix millisecond timestamp
	state.index.groupRewardClaimed.lastClaimed *= 1000
	state.index.vipRewardClaimed.lastClaimed *= 1000
	state.index.clubRewardClaimed.lastClaimed *= 1000

	-- then move petIdClaimed -> lastPetIdClaimed
	state.index.groupRewardClaimed.lastPetIdClaimed = state.index.groupRewardClaimed.petIdClaimed
	state.index.vipRewardClaimed.lastPetIdClaimed = state.index.vipRewardClaimed.petIdClaimed
	state.index.clubRewardClaimed.lastPetIdClaimed = state.index.clubRewardClaimed.petIdClaimed
	state.index.groupRewardClaimed.petIdClaimed = nil
	state.index.vipRewardClaimed.petIdClaimed = nil
	state.index.clubRewardClaimed.petIdClaimed = nil

	-- move items to new locations
	state.index.clubRewards = state.index.clubRewardClaimed
	state.index.clubRewardClaimed = nil

	state.index.groupRewards = state.index.groupRewardClaimed
	state.index.groupRewardClaimed = nil

	state.index.vipRewards = state.index.vipRewardClaimed
	state.index.vipRewardClaimed = nil

	-- change format of gameVersion from Array<string> to Set<String> and move to gameVersionsPlayed
	local newGameVersion = {}
	for _, version in state.index.gameVersion do
		newGameVersion[version] = true
	end

	state.index.gameVersionsPlayed = newGameVersion
	state.index.gameVersion = nil

	-- turn index.pets from Map<string, T> into Array<{ petId: number } & T>
	local newPetIndex = {}
	for stringPetId, value in state.index.pets do
		value["petId"] = tonumber(stringPetId)
		newPetIndex = value
	end
	state.index.pets = newPetIndex

	-- convert index.pets[number]["maxLevel"][Y]["masteryCache"] from Array<string> to Set<string> and rename to "cachedMaxLevel"
	for _, pet in state.index.pets do
		for _, rarityData in pet.maxLevel do
			local newMaxLevel = {}
			for _, guid in rarityData.masteryCache do
				newMaxLevel[guid] = true
			end

			rarityData.cachedMaxLevel = newMaxLevel
			rarityData.masteryCache = nil
		end
	end

	return state
end
