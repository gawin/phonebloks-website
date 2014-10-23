# Phonebloks website


## Goals

The first Phonebloks website was written in WordPress, which gave us problems when scaling to milions of visitors per day. We decided to optimise the Phonebloks website for high traffic and try to cache as much as possible.

- Fast with high loads
- Desktop and mobile compatible
- Clean interface
- Use standards
- KISS (Keep It Simple and Stupid)


## Technical

The website is build using the following technical dept.

- [nginx](http://nginx.org)
- [Lua](http://www.lua.org)
- [Lua Rocks](http://luarocks.org)
- [Ruby](https://www.ruby-lang.org)
- [Redis](http://redis.io)
- [Bootstrap 3](http://getbootstrap.com)

We use nginx as a webserver because it supports running Lua as a [HttpLuaModule](http://wiki.nginx.org/HttpLuaModule), this gives us solid performance at a minimal system load. Combined with the Redis key-value store we are able to maintain a stable and fast website. On the back-end there are Ruby workers that handle the processing of data, these workers can work asynchronous and standalone from the nginx/Lua website. On the front end we use Bootstrap 3 to re-use common design patterns.


## Translations

The website supports multiple translations, these can be edited using the locale translation files.
Locale translation files contain a KEY and a VALUE (translation). For each language the KEY's stay the same, but the second part, the VALUE is different per translation.
Translations are located in: `/app/locale` and use a ISO 3166-1 alpha-2 coding for the filename, for example: `en.json`.
If translation KEYS are added or removed in the HTML view, the translations files should also be updated accordingly.