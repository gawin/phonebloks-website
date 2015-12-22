# Phonebloks website

_This is an archived repository of the [phonebloks.com](https://phonebloks.com) website for historical purposes._
_It was used from Friday 13th of September 2013 till 1st of October 2015 and served milions of visitors._

![Screenshot](https://raw.githubusercontent.com/gawin/phonebloks-website/master/screenshot.png?raw=true)


## Phonebloks

[Phonebloks](https://phonebloks.com) is a concept for an open modular phone. It had a social media reach of over [380.000.000](https://www.thunderclap.it/projects/2931-phonebloks). Its goal was to create awareness about electronic waste and how we use everyday technologies. Phonebloks was a non-profit project run by volunteers. 

Phonebloks and Google collaborated on its successor [Project Ara](http://www.projectara.com/).

## Website Goals

The first Phonebloks website was developed in WordPress by [Dave](http://davehakkens.nl), which did not scale well and caused the server to die at approximately 500+ concurrent visitors. At that point [Gawin](https://gaw.in) joined to help Dave resolve these issues. This was before the first video went viral. Gawin decided to optimize the Phonebloks website for large amount of visitors, trying to cache as much as possible, switching from WordPress to something more lightweight. These were the inital requirements:

- Fast with high loads
- Be cache friendly
- Desktop and mobile compatible
- Clean interface
- Use standards
- KISS (Keep It Simple and Stupid)

## Technical

The website is build using:

- [nginx](http://nginx.org)
- [Lua](http://www.lua.org)
- [Lua Rocks](http://luarocks.org)
- [Ruby](https://www.ruby-lang.org)
- [Redis](http://redis.io)
- [Bootstrap 3](http://getbootstrap.com)

We use nginx as a webserver because it supports running Lua as a [HttpLuaModule](http://wiki.nginx.org/HttpLuaModule), this gives us solid performance at a minimal system load. Combined with the Redis key-value store we are able to maintain a stable and fast website. On the back-end there are Ruby workers that handle the processing of data, these workers can work asynchronous and standalone from the nginx/Lua website. On the front end we use Bootstrap 3 to re-use common design patterns.

## Server

Since everything is designed to be cached, except for the donations and mailing list API calls, the website only needed a single 512MB virtual machine running Ubuntu and nginx, with the assistance of a single local Redis instance. In front of the virtual machine we used very aggressive caching from [A10](https://www.a10networks.com) appliances sponsored by [CYSO](https://cyso.com), which in their turn where shielded by [CloudFlare](https://cloudflare.com) caching and DDoS protection. We experienced several larger (300+ Mbps) DDoS attacks, which were all mitigated without downtime. Hurrah!

## Performance

After some adjustments to nginx and Redis we were able to achieve a throughput of 180.000 requests per second for the API calls, which where only hit when a user subscribed to the mailing list or made a donation. Combined with the heavily cached front-end this handled our average 10 million visitors a month easily. On the 29th and 30th of October 2013 we served over 50+ million page views during our [Thunderclap campaign](https://www.thunderclap.it/projects/2931-phonebloks) without a sweat.

## Translations

After translating our [initial video](https://www.youtube.com/watch?v=oDAw7vW7H0c) to 21 languages, people started asking for translated versions of the website. This website supports multiple translations, these can be edited using the locale translation files.
Locale translation files contain a KEY and a VALUE (translation). For each language the KEY's stay the same, but the second part, the VALUE is different per translation.
Translations are located in: `/app/locale` and use a ISO 3166-1 alpha-2 coding for the filename, for example: `en.json`.
If translation KEYS are added or removed in the HTML view, the translations files should also be updated accordingly. Initial support for new locales is defined in the controller. Unfortunately translating the long translation file was a bit much for most volunteering translators, resulting in only a English version.

## Not included

The source for the Ruby workers (for the Sendgrid mailing list, Stripe and Paypal) and the script that compiled the Lua code into one single nginx config file (for speed optimizations) are not included.

## Disclaimer

Gawin coded the initial version of this project in a single night which wasn't possible without the tirtemplate.lua inspiration, unfortunately the original blog article he used is no longer available. Gawin still owes the original author of tirtemplate.lua a proper contribution and a refreshing beer ;-)

The code is licensed under the MIT License.