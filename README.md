# WoWthing Again

This is a rewrite of [the original WoWthing project](https://gitlab.com/thing-engineering/wowthing) for several reasons:

- Too many languages to keep track of: Python website, Go backend, JS frontend, Lua addon. I work with C# and TypeScript in my day job, neither of which are used in the old stack.
- The [frontend code](https://gitlab.com/thing-engineering/wowthing/wowthing/-/tree/master/assets) is an unmanageable mess, including a single 145KB JS file.
- Everything to do with setting up development/production environments was awful, it's time to use reproducible environments (Docker/Docker Compose).
- .NET Core has matured to the point where it's solid and usable on Linux.

## What is WoWthing?

WoWthing is a web tool to help manage your [World of Warcraft](https://worldofwarcraft.com/en-us/) characters. It makes extensive use of:
 
- The [Battle.net API](https://develop.battle.net/documentation) to retrieve data and for user login
- An in-game addon to cover the many holes in API data
- Various community sites for research/data: [Wowhead](https://www.wowhead.com), [WowDB](https://www.wowdb.com), and [WoW.tools](https://wow.tools)


### Features

- Home - quick overview of your characters
   - Race, class, specialization icons
   - Name
   - Realm
   - Gold
   - Mount skill including upgradeability
   - Renown level
   - Status of weekly anima/souls quests
   - Mythic+ keystone (and if it's a score upgrade)
   - Weekly vault
- Gear - see all of your equipped items
- Mythic+ - see current week and per-season information
   - Current keystone (and if it's a score upgrade)
   - [RaiderIO](https://raider.io) score
   - Badge for completing all dungeons in time at 5/10/15/20 level
   - Best timed/untimed (if higher) key levels for each dungeon
- Reputations - per-expansion reputation levels
- Mounts - which mounts you have collected
- Toys - which toys you have collected


TODO

- screenshots
- link to alternatives - Altoholic addon, ???

## Getting it running

You're going to need API credentials:

1. Log in or sign up for a [Battle.Net Developer](https://develop.battle.net) account
1. Create an API client by visiting `API ACCESS` in the nav bar:
    - Client Name: something unique like "Steve's WoWthing"
    - Redirect URLs: `https://localhost:55501/signin-battlenet`
    - Service URL: `https://wowthing.org` probably
    - Intended Use: I go with some variation of "A website for keeping track of multiple WoW
      characters"
    - Click `SAVE`

1. Clone the repository using whatever Git client you feel like using, I like [Fork](https://git-fork.com/)
1. Create a `.dev` file in the root directory with values from your Battle.Net API Client:
    ```
    BattleNet__ClientID=abcdefg
    BattleNet__ClientSecret=t0ps3cr3tk3y
    ```

1. Install Docker and Docker Compose - [Windows install instructions](https://docs.docker.com/docker-for-windows/install/)
1. Run `docker-compose up --build` in a terminal window to start everything. In future, you can run
   `docker-compose up -d` and use something like [lazydocker](https://github.com/jesseduffield/lazydocker)
   for easier monitoring.
1. Visit https://localhost:55501 and accept the security warning (self-signed certificate)

## Database changes

Changes need to be made in the `Wowthing.Lib` project. If adding a new column, make sure it's
nullable or that it has a  default value. If adding a new model, remember to add a `DbSet<TModel>`
property to `WowDbContext`.

1. Start a shell: `docker-compose exec backend bash`
1. Create a migration: `./ef.sh migrations add Descriptive_Name_Here`
1. Apply migrations: `./ef.sh database update` (or just wait for backend/web to restart and apply
   it)

## Other useful commands

1. Postgres: `docker-compose exec postgres psql -U wowthing wowthing`
1. Redis: `docker-compose exec redis redis-cli`


## TODO

- pull requests - CONTRIBUTING.md?
