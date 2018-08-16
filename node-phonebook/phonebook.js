var fs = require("fs");
var readline = require("readline");

var createReadLineInterface = function () {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout    
    });
};

var phoneBook;

var menu = `
Electronic Phone Book
=====================
1. Look up an entry
2. Create an entry
3. Delete an entry
4. List all entries
5. Quit
`;

var runPhoneBook = function () {
    fs.readFile("phone-book.txt", "utf8", function (error, content) {
        phoneBook = JSON.parse(content || '{}');
        openPhoneBookMenu();
    });
};

var openPhoneBookMenu = function () {
    console.log(menu);
    var rl = createReadLineInterface();
    rl.question("What do you want to do (1 - 5)? ", function (option) {
        rl.close();
        openMenuOption(option);
    });
}

var openMenuOption = function (option) {
    switch (option) {
        case '1':
            lookUpEntry();
            break;
        case '2':
            createEntry();
            break;
        case '3':
            deleteEntry();
            break;
        case '4':
            listAllEntries();
            break;
        case '5':
            quitPhoneBook();
            break;
        default:
            console.log("Invalid Choice: ");
            openPhoneBookMenu();
    }
};

var lookUpEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Lookup Name: ", function (name) {
        rl.close();
        if (phoneBook.hasOwnProperty(name)) {
            console.log(`${name}: ${phoneBook[name]}`);
        } else {
            console.log(`No Entry Found for ${name}`);
        }
        openPhoneBookMenu();
    });
};

var createEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Name: ", function (name) {
        rl.question("Phone Number: ", function (phone) {
            rl.close();
            phoneBook[name] = phone;
            openPhoneBookMenu();
        });
    });
};

var deleteEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Enter Name: ", function (name) {
        rl.close();
        if (phoneBook.hasOwnProperty(name)) {
            console.log(`${name}: ${phoneBook[name]} has been removed from Phone Book.`);
            delete phoneBook[name];
        } else {
            console.log(`No Entry Found for ${name}`);
        }
        openPhoneBookMenu();
    });
};

var listAllEntries = function () {
    for (var contact in phoneBook) {
        console.log(`${contact}: ${phoneBook[contact]}`);
    }
    openPhoneBookMenu();
};

var quitPhoneBook = function () {
    fs.writeFile("phone-book.txt", JSON.stringify(phoneBook), function (error) {
        console.log("Goodbye!!");
    });
};

runPhoneBook();