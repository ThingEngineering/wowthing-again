# Maintenance

Various manual processes.

## Update account names

1. Copy the query out of `bin/sql.py` and run it against the database
2. Paste the query output into the `"""` block in `bin/sql.py`
3. `$ python3 bin/sql.py`
4. Run the output of that against the database

## Unassociate idle characters

`PlayerCharacter` objects with `account_id = NULL` aren't scheduled for updates, this query
unassociates any character that belongs to a user that hasn't visited in the last 6 months.

```sql
UPDATE  player_character
SET     account_id = NULL
WHERE   account_id IN (
    SELECT  id
    FROM    player_account
    WHERE   user_id IN (
        SELECT  id
        FROM    asp_net_users
        WHERE   last_api_check = '-infinity' OR
                last_api_check < (CURRENT_TIMESTAMP - '6 months'::interval)
    )
)
;
```
