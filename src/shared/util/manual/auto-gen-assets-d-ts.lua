-- instructions:
-- put the assets.lua into a ModuleScript inside ServerScriptService, then run this script inside the command bar
-- it will generate an output file in ServerScriptService, which you can then paste into assets.d.ts
local assets = require(game.ServerScriptService.assets)

local gen = [[declare namespace assetIds {
	const ]]

function generateSection(sec)
	local res = ''
	for key, value in pairs(sec) do
		if not (key:find(' ') or key:find('-') or key:find('^%d') or key:find('+')) then
			res = res .. key .. ': '
		else
			res = res .. "'" .. key .. "': "
		end
		if type(value) == 'table' then
			res = res .. '{\n'..generateSection(value)..'};\n'
		elseif type(value) == 'string' then
			res = res ..'string;\n'
		end
	end

	return res
end

local res = generateSection(assets):sub(0, -2)
res = res:gsub("'images'", 'images')

gen = gen .. res .. '\n}\n\nexport = assetIds;\n'

local output = game.ServerScriptService:FindFirstChild('output')
if not output then
	output = Instance.new('ModuleScript')
	output.Name = 'output'
	output.Parent = game.ServerScriptService
end
output.Source = gen
print('DONE. SEE ServerScriptService > output')
return nil