#====================================
#     PHONE BOOK
#===================================
def main_screen():
    print "Electronic Phone Book"
    print "====================="
    print "1. Look up an entry"
    print "2. Set an entry"
    print "3. Delete an entry"
    print "4. List all entries"
    print "5. Quit"
    choice = raw_input("What do you want to do (1 - 5)? ")
    redirect(choice)


def redirect(choice):
    if choice == '1':
        lookup_entry()
    elif choice == '2':
        set_an_entry()
    elif choice == '3':
        delete_entry()
    elif choice == '4':
        list_all_entries()
    elif choice == '5':
        print "Bye!"
    else:
        main_screen()

def lookup_entry():
    name = raw_input("Name: ")
    print "Found entry for %s: %s" % (phone_book[name.lower()]['name'], phone_book[name.lower()]['number'])
    main_screen()

def set_an_entry():
    name = raw_input("Name: ")
    phone_number = raw_input("Phone Number: ")
    phone_book[name.lower()] = {'name': name, 'number': phone_number}
    print "Entry stored for %s" % name
    main_screen()

def delete_entry():
    name = raw_input("Name: ")
    del phone_book[name.lower()]
    print "Deleted entry for: %s" % name
    main_screen()

def list_all_entries():
    for person in phone_book:
        print "Found entry for %s: %s" % (phone_book[person]['name'], phone_book[person]['number'])
    main_screen()


phone_book = {}
main_screen()