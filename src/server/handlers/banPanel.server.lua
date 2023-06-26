local Chat = game:GetService("Chat")
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")

local AUTH_CODE = "7xT77uJU7mD722Fr6D6k1W6877P"

local BAN_URL = "https://api.bloxban.com/place/ban_list?game_id="
	.. game.PlaceId
	.. "&auth="
	.. AUTH_CODE
	.. "&sv=1.0.0&data="
local BAN_TEMPLATE = "\n\n\rYou're Banned\n\n\rReason:\t{reason}\n\n\rTime:\t{time}\n"

local AUTO_UPDATE_INTERVAL = 30

if RunService:IsStudio() then
	return
end

local ActiveBanList = {}

local function GetUsersArray()
	local idArray = {}
	for i, v in ipairs(Players:GetPlayers()) do
		table.insert(idArray, v.UserId)
	end
	return HttpService:JSONEncode(idArray)
end

local function CacheNewBanList(newBanList)
	local newList = {}
	for i, v in pairs(newBanList) do
		if i == "Settings" then
			if v.Default_Message then
				BAN_TEMPLATE = v.Default_Message
			end
			continue
		end
		newList[v.rbx_id] = v
	end

	return newList
end

local function UpdateBanList()
	local getBanSuccess, banListStr = pcall(HttpService.GetAsync, HttpService, BAN_URL .. GetUsersArray())

	if not getBanSuccess then
		warn("Failed GET request to Ban Server.")
		return ActiveBanList
	end

	local decodeBanListSuccess, decodedBanList = pcall(HttpService.JSONDecode, HttpService, banListStr)
	if not decodeBanListSuccess then
		warn("Unable to decode ban server data to JSON format.")
		return ActiveBanList
	end
	ActiveBanList = CacheNewBanList(decodedBanList)
	return ActiveBanList
end

local LastUpdateInterval = 0
local function CheckListUpdate()
	if os.clock() - LastUpdateInterval < AUTO_UPDATE_INTERVAL then
		return
	end

	LastUpdateInterval = os.clock()
	UpdateBanList() -- Update
end

-- // Module // --
local Module = {}

function Module:CheckPlayerBanned(LocalPlayer, customDebugMessage)
	CheckListUpdate()

	local BanData = ActiveBanList[tostring(LocalPlayer.UserId)]

	if not BanData then
		return false
	end

	local banMessage = BAN_TEMPLATE
	banMessage = string.gsub(banMessage, "{reason}", BanData.ban_reason or "No Reason Given")
	banMessage = string.gsub(banMessage, "{time}", BanData.ban_time or "Unknown Duration")

	LocalPlayer:Kick(banMessage)

	return true, banMessage
end

task.spawn(function()
	while task.wait(AUTO_UPDATE_INTERVAL / 2) do
		for _, LocalPlayer in ipairs(Players:GetPlayers()) do
			task.spawn(function()
				Module:CheckPlayerBanned(LocalPlayer, "Check on Startup")
			end)
		end
	end
end)

task.spawn(function()
	if #Players:GetPlayers() == 0 then
		Players.PlayerAdded:Wait()
	end
	-- On Server Startup
	CheckListUpdate()
	-- Updating on every join after that
	for _, LocalPlayer in ipairs(Players:GetPlayers()) do
		task.spawn(function()
			Module:CheckPlayerBanned(LocalPlayer, "Check on Startup")
		end)
	end
	Players.PlayerAdded:Connect(function(LocalPlayer)
		UpdateBanList()
		Module:CheckPlayerBanned(LocalPlayer, "On Joined Ban Check")
	end)
end)

-- In the event that it is a module script
-- return Module
