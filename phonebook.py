#====================================
#     PHONE BOOK
#===================================
menu = '''
Electronic Phone Book
=====================
1. Look up an entry
2. Create an entry
3. Delete an entry
4. List all entries
5. Quit
'''

phonebook = {}

def run_phonebook():
    print menu
    choice = raw_input("What do you want to do (1 - 5)? ")
    if choice in menu_choices:
        menu_choice = menu_choices[choice]
        print menu_choice()
    else:
        print "Invalid Try Again"
    return choice != '5'

def lookup_entry():
    name = raw_input('Enter name: ')
    if name in phonebook:
        return "Found entry for %s: %s" % (name, phonebook[name])
    else:
        return "not valid"

def set_an_entry():
    name = raw_input('Name: ')
    phone = raw_input('Phone Number:')
    phonebook[name] = phone
    return "Entry stored for %s" % name

def delete_entry():
    name = raw_input('Enter name: ')
    if name in phonebook:
        del phonebook[name]
        return "Deleted entry for %s" %name
    else: 
        return "%s not found." % name

def list_all_entries():
    entries = ''
    for name in phonebook:
        entries += "Found Entry for %s: %s\n" % (name, phonebook[name])
    return entries

def quit_phonebook():
    return "Bye!"

menu_choices = { 
    '1': lookup_entry,
    '2': set_an_entry,
    '3': delete_entry,
    '4': list_all_entries,
    '5': quit_phonebook,
}

running = True
while running:
    running = run_phonebook()