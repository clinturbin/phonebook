const http = require('http');
const fs = require('fs');
const contactPrefix = '/contacts';

let contacts;

let readPhoneBookFromFile = () => {
    fs.readFile("phone-book.txt", "utf8", (error, content) => {
        contacts = JSON.parse(content || '{}');
        startServer();
    });
};

let generateRandomID = () => Math.floor(Math.random() * 100000).toString();

let startServer = () => {
    http.createServer((req, res) => {
        if (req.url === contactPrefix && req.method === 'GET') {
            displayAllContacts(res);
        } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
            displayOneContact(req, res);
        } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
            deleteContact(req, res);
        } else if (req.url.startsWith(contactPrefix) && req.method === 'PUT') {
            updateContact(req, res);
        } else if (req.url === contactPrefix && req.method === "POST") {
            createNewContact(req, res);
        } else {
            res.end('404 no contacts here');
        }
    }).listen(3000);
};

let displayAllContacts = (res) => res.end(JSON.stringify(contacts));

let displayOneContact = (req, res) => {
    let contactId = req.url.slice(contactPrefix.length + 1);
    if (contacts.hasOwnProperty(contactId)) {
        res.end(JSON.stringify(contacts[contactId]['name']));
    } else {
        res.end("Info Not Found");
    }
};

let deleteContact = (req, res) => {
    let contactId = req.url.slice(contactPrefix.length + 1);
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
    readBody(req, (contact) => {
        let randomId = generateRandomID();
        contacts[randomId] = contact;
        contacts[randomId]['id'] = randomId;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end('Created Contact');
        });
    });
};

let updateContact = (req, res) => {
    let contactId = req.url.slice(contactPrefix.length + 1);
    if (contacts.hasOwnProperty(contactId)) {
        updateContactNameAndPhone(req, res, contactId);
    } else {
        res.end('No Contact Found');
    }
};

let updateContactNameAndPhone = (req, res, contactId) => {
    readBody(req, (contact) => {
        contacts[contactId]['name'] = contact['name'];
        contacts[contactId]['phone'] = contact['phone'];
        console.log(contacts[contactId]['name'] + ": " + contacts[contactId]['phone']);
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end('Contact Updated');
        });
    });
};

let readBody = (req, callback) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let contact = JSON.parse(body);
        callback(contact);
    });
};

readPhoneBookFromFile();