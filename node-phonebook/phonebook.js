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
`

var createReadLineInterface = function () {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout    
    });
};


// Get user input to select what to do
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
            quitPhoneBook();
            break;
        default:
            console.log("Invalid Choice");
    }
};

// var lookUpEntry = function () {
//     console.log("lookup entry selected");
// };


var getPhoneBookFromFile = function (content) {
    if (content === '') {
        return {};
    } else {
        return JSON.parse(content)
    }
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
                    console.log(phoneBook);
                    showMainMenu();
                });
            });
        });
    });
};

// var addContactToFile = function (contact) {
//     fs.readFile("phone-book.txt", "utf8", function (error, contacts) {
//         var phoneBook = JSON.parse(contacts);
//         fs.writeFile("phone-book.txt", contact, function () {

//         })
//     })
//     fs.writeFile("phone-book.txt", content., function (error) {
//         if (error) {
//             console.log(error.message);
//         } else {
//             console.log("Input file: %s", inputFile);
//             console.log("Output file: %s", outputFile);
//             console.log("Wrote to file %s", outputFile);
//         }
//     });
// };

// var deleteEntry = function () {
//     console.log("deleteEntry selected");
// };

// var listAllEntries = function () {
//     console.log("listAllEntries selected");
// };

// var quitPhoneBook = function () {
//     console.log("quitPhoneBook selected");
// };

var showMainMenu = function () {
    console.log(menu);
    selectedMenuOption();    
};

showMainMenu();