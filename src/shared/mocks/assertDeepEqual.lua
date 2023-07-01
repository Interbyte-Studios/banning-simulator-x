--!strict
--[[
	Credit to Roblox for these functions, original source retrieved from
	https://github.com/Roblox/roact/blob/82b805a3ece0beb7b5a8628410ae8e0b1e2c282e/src/assertDeepEqual.lua

	A utility used to assert that two objects are value-equal recursively. It
	outputs fairly nicely formatted messages to help diagnose why two objects
	would be different.

	This should only be used in tests.

	Licensed under Apache-2.0

	Changes to original source code:
	* Modified return statement to export assertDeepEqual as member of a table, rather than a function
	* Modified assertDeepEqual to allow for a custom `message` argument
]]

local function deepEqual(a: any, b: any): (boolean, string?)
	if typeof(a) ~= typeof(b) then
		local message = ("{1} is of type %s, but {2} is of type %s"):format(typeof(a), typeof(b))
		return false, message
	end

	if typeof(a) == "table" then
		local visitedKeys = {}

		for key, value in pairs(a) do
			visitedKeys[key] = true

			local success, innerMessage = deepEqual(value, b[key])
			if not success and innerMessage then
				local message = innerMessage
					:gsub("{1}", ("{1}[%s]"):format(tostring(key)))
					:gsub("{2}", ("{2}[%s]"):format(tostring(key)))

				return false, message
			end
		end

		for key, value in pairs(b) do
			if not visitedKeys[key] then
				local success, innerMessage = deepEqual(value, a[key])

				if not success and innerMessage then
					local message = innerMessage
						:gsub("{1}", ("{1}[%s]"):format(tostring(key)))
						:gsub("{2}", ("{2}[%s]"):format(tostring(key)))

					return false, message
				end
			end
		end

		return true, nil
	end

	if a == b then
		return true, nil
	end

	local message = "{1} ~= {2}"
	return false, message
end

local function assertDeepEqual(a, b, message)
	local success, innerMessageTemplate = deepEqual(a, b)

	if not success and innerMessageTemplate then
		local innerMessage = innerMessageTemplate:gsub("{1}", "first"):gsub("{2}", "second")

		error(("%s\n%s"):format(message ~= nil and message or "Values were not deep equal", innerMessage), 2)
	end
end

return {
	assertDeepEqual = assertDeepEqual,
}
