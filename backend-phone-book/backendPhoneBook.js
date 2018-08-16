var http = require('http');
var fs = require('fs');

var contacts;

var readPhoneBookFromFile = function () {
    fs.readFile("phone-book.txt", "utf8", function (error, content) {
        contacts = JSON.parse(content || '{}');
        startServer();
    });
};

var startServer = function () {
    var contactPrefix = '/contacts/';
    http.createServer(function (req, res) {
        if (req.url === '/contacts' && req.method === 'GET') {
            res.end(displayAllContacts());
        } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
            res.end(displayOneContact(req, contactPrefix));
        } else {
            res.end('404 no contacts here');
        }
    }).listen(3000);
};

var displayAllContacts = function () {
    return JSON.stringify(contacts);
};

var displayOneContact = function (req, contactPrefix) {
    var name = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(name)) {
        return `Phone number for ${name} is ${contacts[name]}`;
    } else {
        return `No contact info for ${name}`;
    }
};

readPhoneBookFromFile();