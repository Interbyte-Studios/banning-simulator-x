local ServerScriptService = game:GetService("ServerScriptService")
local Players = game:GetService("Players")

local ChatService = require(ServerScriptService:WaitForChild("ChatServiceRunner"):WaitForChild("ChatService"))

local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local TITLES = TS.import(script, game:GetService("ReplicatedStorage"), "bsx_shared", "configs", "titles").TITLES
local retrieveStore = TS.import(script, game:GetService("ServerScriptService"), "playerStore").retrieveStore

ChatService.SpeakerAdded:Connect(function(playerName)
	local speaker = ChatService:GetSpeaker(playerName)
	assert(speaker, string.format('Expected to find speaker object for chat speaker "%s"', playerName))

	local player = Players:FindFirstChild(playerName)
	assert(player, string.format('Expected to find player object for chat speaker "%s"', playerName))

	local store = retrieveStore(player)
	local title = store:getState().title

	if title then
		local _arg0 = function(_title)
			return _title.name == title
		end
		-- ▼ ReadonlyArray.find ▼
		local _result
		for _i, _v in TITLES do
			if _arg0(_v, _i - 1, TITLES) == true then
				_result = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		local titleData = _result
		local _arg1 = 'Failed to retrieve data for title named: "' .. (title .. '"')
		assert(titleData, _arg1)

		speaker:SetExtraData("Tags", {
			{
				TagText = titleData.name,
				TagColor = typeof(titleData.effect) == "Color3" and titleData.effect or Color3.fromRGB(255, 255, 255),
			},
		})
	end

	store.changed:connect(function(newState, oldState)
		if newState.title == oldState.title then
			return
		end

		local _arg0 = function(_title)
			return _title.name == newState.title
		end
		-- ▼ ReadonlyArray.find ▼
		local _result
		for _i, _v in TITLES do
			if _arg0(_v, _i - 1, TITLES) == true then
				_result = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		local titleData = _result
		local _arg1 = 'Failed to retrieve data for title named: "' .. newState.title .. '"'
		assert(titleData, _arg1)

		speaker:SetExtraData("Tags", {
			{
				TagText = titleData.name,
				TagColor = typeof(titleData.effect) == "Color3" and titleData.effect or Color3.fromRGB(255, 255, 255),
			},
		})
	end)
end)
