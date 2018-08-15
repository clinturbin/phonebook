var fs = require("fs");
var readline = require("readline");

var menu = `
Electronic Phone Book
=====================
1. Look up an entry
2. Create an entry
3. Delete an entry
4. List all entries
5. Quit
`;

var createReadLineInterface = function () {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout    
    });
};

var selectedMenuOption = function () {
    var rl = createReadLineInterface();
    rl.question("What do you want to do (1 - 5)? ", function (option) {
        rl.close();
        openMenuOption(option);
    });
};


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
            console.log("Goodbye!!")
            break;
        default:
            console.log("Invalid Choice: ");
            selectedMenuOption();
    }
};

var getPhoneBookFromFile = function (content) {
    return JSON.parse(content || '{}');
    // if (content === '') {
    //     return {};
    // } else {
    //     return JSON.parse(content)
    // }
};

var lookUpEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Lookup Name: ", function (name) {
        rl.close();
        fs.readFile("phone-book.txt", "utf8", function (error, content) {
            var phoneBook = getPhoneBookFromFile(content);
            if (Object.keys(phoneBook).includes(name)) {
                console.log(`${name}: ${phoneBook[name]}`);
            } else {
                console.log(`No Entry Found for ${name}`);
            }
            showMainMenu();
        });
    });
};

var createEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Name: ", function (name) {
        rl.question("Phone Number: ", function (phone) {
            rl.close();
            fs.readFile("phone-book.txt", "utf8", function (error, content) {
                var phoneBook = getPhoneBookFromFile(content);
                phoneBook[name] = phone;
                fs.writeFile("phone-book.txt", JSON.stringify(phoneBook), function (error) {
                    console.log(`${name}: ${phone} - added to Phone Book!`);
                    showMainMenu();
                });
            });
        });
    });
};

var deleteEntry = function () {
    var rl = createReadLineInterface();
    rl.question("Enter Name: ", function (name) {
        rl.close();
        fs.readFile("phone-book.txt", "utf8", function (error, content) {
            var phoneBook = getPhoneBookFromFile(content);
            if (Object.keys(phoneBook).includes(name)) {
                delete phoneBook[name];
                fs.writeFile("phone-book.txt", JSON.stringify(phoneBook), function (error) {
                    console.log(`${name} removed from Phone Book`);
                    showMainMenu();
                });
            } else {
                console.log(`No Entry Found for ${name}`);
                showMainMenu();
            }
        });
    });
};

var listAllEntries = function () {
    fs.readFile("phone-book.txt", "utf8", function (error, content) {
        var phoneBook = getPhoneBookFromFile(content);
        for (var contact in phoneBook) {
            console.log(`${contact}: ${phoneBook[contact]}`);
        }
        showMainMenu();
    });
};

var showMainMenu = function () {
    console.log(menu);
    selectedMenuOption();    
};

showMainMenu();