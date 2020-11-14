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

## Getting it running

You're going to need API credentials:

1. Log in or sign up for a [Battle.Net Developer](https://develop.battle.net) account
1. Create an API client, "API ACCESS" in the nav bar:
    - Client Name: something unique like "Steve's WoWthing"
    - Redirect URLs: `http://localhost:55500/something` TODO
    - Service URL: `https://wowthing.org` probably
    - Intended Use: I go with some variation of "A website for keeping track of multiple WoW characters"
    - SAVE

1. Clone the repository using whichever Git client you feel like using, I like [Fork](https://git-fork.com/)
1. Create a `.dev` file in the root of this repository with the values from your Battle.Net API Client:
    ```
    BattleNet__ClientID=abcdefg
    BattleNet__ClientSecret=t0ps3cr3tk3y
    ```

1. Install Docker and Docker Compose - [Windows install instructions](https://docs.docker.com/docker-for-windows/install/)
1. Run `docker-compose up --build` in a terminal window to start everything
1. Visit http://localhost:55500

## Database changes

Changes need to be made in the `Wowthing.Lib` project. If adding a new column, make sure it's nullable or that it has a  default value. If adding a new model, remember to add a `DbSet<Model>` property to `WowDbContext`.

1. Start a shell: `docker-compose exec backend bash`
1. Create a migration: `./ef.sh migrations add Descriptive_Name_Here`
1. Apply migrations: `./ef.sh database update` (or just wait for backend/web to restart and apply it)


## TODO

- pull requests - CONTRIBUTING.md?
