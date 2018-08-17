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

let displayAllContacts = (req, res) => res.end(JSON.stringify(contacts));

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
        contact.id = randomId;
        contacts[randomId] = contact;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end(JSON.stringify(contact));
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

let noContactsFound = (req, res) => {
    res.end("Error 404 No Contacts Found");
};

let routes = [
    {
        method: 'GET',
        url: '/contacts/',
        run: displayOneContact
    },
    {
        method: 'GET',
        url: '/contacts',
        run: displayAllContacts
    },
    {
        method: 'DELETE',
        url: '/contacts/',
        run: deleteContact
    },
    {
        method: 'POST',
        url: '/contacts',
        run: createNewContact
    },
    {
        method: 'PUT',
        url: '/contacts/',
        run: updateContact
    },
    {
        method: 'GET',
        url: '',
        run: noContactsFound
    },
];

let startServer = () => {
    let server = http.createServer((req, res) => {
        let route = routes.find(route => req.url.startsWith(route.url) && req.method === route.method);
        route.run(req, res);
    });
    server.listen(3000);
};

readPhoneBookFromFile();