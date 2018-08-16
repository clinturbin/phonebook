var http = require('http');
var fs = require('fs');

var contacts;

var readPhoneBookFromFile = function () {
    fs.readFile("phone-book.txt", "utf8", function (error, content) {
        contacts = JSON.parse(content || '{}');
        startServer();
    });
};

var generateRandomID = function () {
    return Math.floor(Math.random() * 100000).toString();
};

var startServer = function () {
    var contactPrefix = '/contacts/';
    http.createServer(function (req, res) {
        if (req.url === '/contacts' && req.method === 'GET') {
            res.end(displayAllContacts());
        } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
            res.end(displayOneContact(req, contactPrefix));
        } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
            res.end(deleteContact(req, contactPrefix));
        } else if (req.url === '/contacts' && req.method === "POST") {
            createNewContact(req, res);
        } else {
            res.end('404 no contacts here');
        }
    }).listen(3000);
};

var displayAllContacts = function () {
    return JSON.stringify(contacts);
};

var displayOneContact = function (req, contactPrefix) {
    var contactId = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(contactId)) {
        return JSON.stringify(contacts[contactId]['name']);
    } else {
        return `Info not found`;
    }
};

var deleteContact = function (req, contactPrefix) {
    var contactId = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(contactId)) {
        delete contacts[contactId];
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), function (error) {
            return `Entry removed`;
        });
    } else {
        return `Contact not found`;
    }
};

var createNewContact = function (req, res) {
    var body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', function () {
        var contact = JSON.parse(body);
        contacts[generateRandomID()] = contact;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), function (error) {
            res.end('Created Contact!');
        });
    });
};

readPhoneBookFromFile();