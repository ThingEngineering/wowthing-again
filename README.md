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

1. Install Docker and Docker Compose - [Windows install instructions](https://docs.docker.com/docker-for-windows/install/)

1. Install the dotnet SDK, currently 8.x

1. Log in or sign up for a [Battle.Net Developer](https://develop.battle.net) account

1. Create an API client by visiting `API ACCESS` in the nav bar:
    - Client Name: something unique like "Steve's WoWthing"
    - Redirect URLs: `https://localhost:55501/signin-battlenet`
    - Service URL: `https://wowthing.org` probably
    - Intended Use: I go with some variation of "A website for keeping track of multiple WoW
      characters"
    - Click `SAVE`

1. Clone the repositories:

    ```bash
    mkdir ~/wowthing
    cd ~/wowthing
    git clone https://github.com/ThingEngineering/wowthing-again
    git clone https://github.com/ThingEngineering/wowthing-data
    git clone https://github.com/ThingEngineering/wow-dumps
    ```

1. Edit your `~/.profile` (or `.bashrc` or `.zshrc` or whatever) and add the following:

    ```bash
    export WOWTHING_DATA_PATH="~/wowthing/wowthing-data"
    export WOWTHING_DUMP_PATH="~/wowthing/wow-dumps"
    export WOWTHING_DATABASE="Host=localhost;Port=55532;Username=wowthing;Password=topsecret"
    export WOWTHING_REDIS="localhost:55579"
    ```

1. Reload that file: `. ~/.profile`

1. Create a `.env` file in the `wowthing-again` directory (at the same level as the `docker-compose.yml` file) with values from your Battle.Net API Client:

    ```
    BattleNet__ClientID=abcdefg
    BattleNet__ClientSecret=t0ps3cr3tk3y
    ```

1. Build the docker images: `docker-compose build`

1. Bring up `web` and dependencies manually first, this will create/migrate the database:

    ```bash
    docker-compose up -d postgres redis web
    docker-compose logs -f web
    ```

1. Once that shows "Now listening on: http://0.0.0.0:5000", start the others:

    ```bash
    docker-compose up -d
    ```

1. Start the initial data import/build, this will take a while:

    ```bash
    cd app/tool/
    dotnet run all
    ```

1. Visit https://localhost:55501 and accept the security warning (self-signed certificate)

### Troubleshooting

- If you have no realms ("Honkstrasza" is not a real realm), reset the timer on the realms job and run `dotnet run static` in the tool directory once `backend` finishes updating.

    ```bash
    $ docker-compose exec redis redis-cli
    127.0.0.1:6379> del scheduled_job:DataRealmIndex_v3
    127.0.0.1:6379> exit
    ```

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

### Troubleshooting

Here is a list of quick tips if you experiment problems with your local development. Note: use the above commands for connecting the Postgres and/or Redis servers.

1. **Reset the full WoWthing docker setup**. Be sure to remove all *stopped-but-not-deleted* dockers with `docker-compose down`. You can check with `docker ps -a`. You can also delete the volumes where all the data are saved with `docker volume pprruunnee` (WARNING: it will remove **ALL** your docker volumes not used, even those not for WoWthing!!! Ok, now that you have read the warning, the real command is with prune, not pprruunnee.)
1. **Database is empty**. Connect to the Postgres database, and list tables with the command `\dt`. If you see only `__EFMigrationsHistory`, then you need to create the extension on the database with `create extension pg_trgm with schema pg_catalog;`, and after restart the docker-compose stuff.

1. **No realm in the database**. Connect to the Postgres database and list the realms with `select * from wow_realm;`. If no realms listed, restart the Redis download job for realms with `del scheduled_job:DataRealmIndex_v2`.

1. **No mounts/pets/toys/... in the database**. Connect to the Postgres database and list the realms with `select * from wow_mount;`/`select * from wow_pet;`/`select * from wow_toy;`/`...`. If nothing is listed, restart the Redis download job for static data with `del scheduled_job:CacheStatic_v37` and `del scheduled_job:CacheJournal_v13`.

1. **Can't have data in wow_mount/wow_pet/..., even with the previous tips**. There seems to be some race conditions on the start of the dockers. On way is to:

    1. have a clean start point (delete dockers and associated volumes)
    1. start the `postgres` and `redis` dockers with `docker-compose up postgres redis`
    1. create the extension on the database (details above)
    1. start the `web` docker in another console with `docker-compose up --build web`
    1. after `web` is initialized, start the `backend` docker in another console with `docker-compose up --build backend`
    1. if needed, restart the Redis downloads for `realms` and/or `mounts/pets/toys/...` (details above)
    1. start the `frontend` docker in another console with `docker-compose up --build frontend`

## TODO

- pull requests - CONTRIBUTING.md?
