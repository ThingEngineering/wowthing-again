query = """
SELECT *
FROM (
    SELECT  user_name,
            REGEXP_REPLACE(settings#>>'{General,DesiredAccountName}', '[ "#]', '') AS desired
    FROM    asp_net_users
) oof
WHERE   desired IS NOT NULL
        AND desired != ''
        AND desired != user_name
;
"""

blah = """
"""

for line in blah.splitlines():
    line = line.strip()
    if line == '':
        continue
    
    current_name, new_name = line.split(' | ')
    current_name = current_name.strip()
    new_name = new_name.replace('"', '')

    print(f"update asp_net_users set user_name = '{new_name}', normalized_user_name = '{new_name.upper()}' where user_name = '{current_name}';")
