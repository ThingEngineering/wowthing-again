# WoWthing Again

This is a rewrite of [the original WoWthing project](https://gitlab.com/thing-engineering/wowthing) for several reasons:

- Too many languages to keep track of: Python website, Go backend, Lua addon. I work with C# and TypeScript in my day job, neither of which are used in the old stack.
- The [frontend code](https://gitlab.com/thing-engineering/wowthing/wowthing/-/tree/master/assets) is an unmanageable mess, including a single 145KB JS file.
- Everything to do with dev/production environments is awful, it's time to use reproducible environments (Docker/Docker Compose).
- .NET Core has matured to the point where it's actually pretty solid, giving me the option of using C# in a Linux-based environment.

## What is WoWthing?

WoWthing is a web tool to help manage your [World of Warcraft](https://worldofwarcraft.com/en-us/) characters. It makes extensive use of:
 
- [Battle.net API](https://develop.battle.net/documentation) to retrieve data and for user login
- An in-game addon to cover the many holes in API data
- Various community sites for research/data: [Wowhead](https://www.wowhead.com), [WowDB](https://www.wowdb.com), and [WoW.tools](https://wow.tools)

TODO

- feature list
- screenshots
- link to alternatives - Altoholic addon, ???

## How do I make it work?

1. Install Docker and Docker Compose - [Windows install instructions](https://docs.docker.com/docker-for-windows/install/)
1. Clone the repository using whichever Git client you feel like using, I like [Fork](https://git-fork.com/)
1. Run `docker-compose up --build`, this will start cache + database + backend + website
1. Visit http://localhost:55500

TODO

- environment variables for bnet oauth
- backend instructions?
- creating/testing database migrations
- pull requests - CONTRIBUTING.md?
