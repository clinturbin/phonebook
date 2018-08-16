const http = require('http');
const fs = require('fs');

let contacts;

let readPhoneBookFromFile = function () {
    fs.readFile("phone-book.txt", "utf8", function (error, content) {
        contacts = JSON.parse(content || '{}');
        startServer();
    });
};

let generateRandomID = function () {
    return Math.floor(Math.random() * 100000).toString();
};

let startServer = function () {
    let contactPrefix = '/contacts/';
    http.createServer(function (req, res) {
        if (req.url === '/contacts' && req.method === 'GET') {
            res.end(displayAllContacts());
        } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
            res.end(displayOneContact(req, contactPrefix));
        } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
            res.end(deleteContact(req, contactPrefix));
        } else if (req.url.startsWith(contactPrefix) && req.method === 'PUT') {
            updateContact(req, contactPrefix);
        } else if (req.url === '/contacts' && req.method === "POST") {
            createNewContact(req, res);
        } else {
            res.end('404 no contacts here');
        }
    }).listen(3000);
};

let displayAllContacts = function () {
    return JSON.stringify(contacts);
};

let displayOneContact = function (req, contactPrefix) {
    let contactId = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(contactId)) {
        return JSON.stringify(contacts[contactId]['name']);
    } else {
        return `Info not found`;
    }
};

// let updateContact = function (req, contactPrefix) {
//     var contactId = req.url.slice(contactPrefix.length);
// }

let deleteContact = function (req, contactPrefix) {
    let contactId = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(contactId)) {
        delete contacts[contactId];
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), function (error) {
            return `Entry removed`;
        });
    } else {
        return `Contact not found`;
    }
};

let createNewContact = function (req, res) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', function () {
        let contact = JSON.parse(body);
        contacts[generateRandomID()] = contact;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), function (error) {
            res.end('Created Contact!');
        });
    });
};

readPhoneBookFromFile();