# WoWthing (again)

WoWthing is a web tool to help manage your [World of Warcraft](https://worldofwarcraft.com/en-us/)
characters. It makes extensive use of:
 
- The [Battle.net API](https://develop.battle.net/documentation) to retrieve data and for user
  login
- An in-game addon to cover the many holes in API data
- Various community sites for research/data: [Wowhead](https://www.wowhead.com), [WowDB](https://www.wowdb.com),
  and [WoW.tools](https://wow.tools)


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


## Development

We're always interested in new ideas, features, etc. Check out the Github Issues to
see if your idea has already been suggested, or to find something to try working on.

Feel free to poke me (Freddie) on [Discord](https://discord.gg/4UkTT5y) if you need
any help with getting started, I'm available most days.

### Projects

- `frontend` (TypeScript, Svelte): most of the magic for the user-facing parts of the site.
  Consumes API data from `WoWthing.Web`. 
- `WoWthing.Backend` (C#): long-running service that handles "jobs" (API calls mostly)
  with multiple workers.
- `WoWthing.Lib` (C#): shared functionality for `Backend/Web` - database models are the major
  thing.
- `WoWthing.Web` (C#): basic shell of the website - auth, basic page layout, API, etc.

### Local setup

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
1. Create a `.env` file in the root directory (at the same level than the `docker-compose.yml` file) with values from your Battle.Net API Client:
    ```
    BattleNet__ClientID=abcdefg
    BattleNet__ClientSecret=t0ps3cr3tk3y
    ```
1. Install Docker and Docker Compose - [Windows install instructions](https://docs.docker.com/docker-for-windows/install/)
1. Run `docker-compose up --build` in a terminal window to start everything. In future, you can run
   `docker-compose up -d` and use something like [lazydocker](https://github.com/jesseduffield/lazydocker)
   for easier monitoring.
1. Visit https://localhost:55501 and accept the security warning (self-signed certificate)

### Making database changes

Changes need to be made in the `Wowthing.Lib` project. If adding a new column, make sure it's
nullable or that it has a  default value. If adding a new model, remember to add a `DbSet<TModel>`
property to `WowDbContext`.

1. Start a shell: `docker-compose exec backend bash`
1. Create a migration: `./ef.sh migrations add Descriptive_Name_Here`
1. Apply migrations: `./ef.sh database update` (or just wait for backend/web to restart and
   apply it)

### Other useful commands

1. Postgres: `docker-compose exec postgres psql -U wowthing wowthing`
1. Redis: `docker-compose exec redis redis-cli`
1. Frontend shell: `docker-compose exec frontend sh`


## TODO

- pull requests - CONTRIBUTING.md?
