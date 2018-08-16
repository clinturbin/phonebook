const http = require('http');
const fs = require('fs');

let contacts;

let readPhoneBookFromFile = () => {
    fs.readFile("phone-book.txt", "utf8", (error, content) => {
        contacts = JSON.parse(content || '{}');
        startServer();
    });
};

let generateRandomID = () => Math.floor(Math.random() * 100000).toString();

let startServer = () => {
    let contactPrefix = '/contacts/';
    http.createServer((req, res) => {
        if (req.url === '/contacts' && req.method === 'GET') {
            res.end(displayAllContacts(res));
        } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
            res.end(displayOneContact(req, contactPrefix));
        } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
            deleteContact(req, res, contactPrefix);
        } else if (req.url.startsWith(contactPrefix) && req.method === 'PUT') {
            updateContact(req, contactPrefix);
        } else if (req.url === '/contacts' && req.method === "POST") {
            createNewContact(req, res);
        } else {
            res.end('404 no contacts here');
        }
    }).listen(3000);
};

let displayAllContacts = () => JSON.stringify(contacts);

let displayOneContact = (req, contactPrefix) => {
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

let deleteContact = (req, res, contactPrefix) => {
    let contactId = req.url.slice(contactPrefix.length);
    if (contacts.hasOwnProperty(contactId)) {
        delete contacts[contactId];
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end("Entry Removed");
        });
    } else {
        res.end("Contact not found");
    }
};

let createNewContact = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let contact = JSON.parse(body);
        contacts[generateRandomID()] = contact;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end('Created Contact!');
        });
    });
};

readPhoneBookFromFile();