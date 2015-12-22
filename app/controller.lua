-- load our template engine
local template = require 'template'

local cjson = require 'cjson'
local os = require 'os'

ngx.header.content_type = 'text/html';
TEMPLATEDIR = ngx.var.root .. '/app/views/';

function menuActive(url_page, menu_item)
    if url_page == menu_item then
        return "active"
    else
        return ""
    end
end

function menuLanguageActive(url_language, menu_language)
    if url_language == menu_language then
        return menu_language .. " active"
    else
        return menu_language .. ""
    end
end

function readFile(file)
    local f = io.open(file, "rb")
    local content = f:read("*all")
    f:close()
    return content
end

-- /index
local function render_page(url_language, url_page)
    local page = template.tload('layouts/layout.html')
    local translation = cjson.decode( readFile( ngx.var.root .. "/app/locale/" .. url_language .. ".json" ) )
    local locales = { language = url_language, page = url_page, t = translation }

    ngx.print(page(locales))
end

-- function to create a table set
function table.set(t) -- set of list
  local u = { }
  for _, v in ipairs(t) do u[v] = true end
  return u
end

local allowed_languages = table.set { "en"}
local allowed_pages     = table.set { "about", "donate", "community", "partners","index", "faq", "newsletter", "contact", "help-us"}
local url_language      = string.sub(ngx.var.uri, 2, 3)
local url_page          = string.sub(ngx.var.uri, 5)

-- remove tailing / from url_page
if string.sub(url_page, -1, -1) == "/" then url_page = string.sub(url_page, 1, -2) end

-- render index if no page is given
if url_page == "" then url_page = "index" end

if allowed_languages[url_language] then
  ngx.header["Set-Cookie"] = {"phonebloks_language=" .. url_language .. "; path=/"}
end

if allowed_languages[url_language] and allowed_pages[url_page] then
  ngx.say(render_page(url_language, url_page))
  return ngx.exit(200)
elseif allowed_languages[url_language] then
  return ngx.redirect("/" .. url_language)
else
  return ngx.redirect("/en")
end
