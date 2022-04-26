blah = """
 513f820de75641f18d1bc68f3ab1042f | "LutzPS"
 4033db3d7a8b43699f21f55c19a174f2 | "AMC"
 8d9fdacc367243dd999b4014c0119153 | "Itsuko"
 ac3efc3b1b5e41a5bce38490344e1f7f | "Nalicka"
"""

for line in blah.splitlines():
    line = line.strip()
    if line == '':
        continue
    
    current_name, new_name = line.split(' | ')
    current_name = current_name.strip()
    new_name = new_name.replace('"', '')
    if len(current_name) != 32:
        continue

    print(f"update asp_net_users set user_name = '{new_name}', normalized_user_name = '{new_name.upper()}' where user_name = '{current_name}';")
