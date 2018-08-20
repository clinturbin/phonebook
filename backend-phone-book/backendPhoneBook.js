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

let displayAllContacts = (req, res, matches) => res.end(JSON.stringify(contacts));

let displayOneContact = (req, res, matches) => {
    let contactId = matches[0];
    if (contacts.hasOwnProperty(contactId)) {
        res.end(JSON.stringify(contacts[contactId]['name']));
    } else {
        res.end("Info Not Found");
    }
};

let deleteContact = (req, res, matches) => {
    let contactId = matches[0];
    if (contacts.hasOwnProperty(contactId)) {
        delete contacts[contactId];
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end("Entry Removed");
        });
    } else {
        res.end("Contact not found");
    }
};

let createNewContact = (req, res, matches) => {
    readBody(req, (contact) => {
        let randomId = generateRandomID();
        contact.id = randomId;
        contacts[randomId] = contact;
        fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
            res.end(JSON.stringify(contact));
        });
    });
};

let updateContact = (req, res, matches) => {
    let contactId = matches[0];
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

let noContactsFound = (req, res, matches) => {
    res.end("Error 404 No Contacts Found");
};

let routes = [
    {
        method: 'GET',
        url: /^\/contacts\/([0-9]+)$/,
        run: displayOneContact
    },
    {
        method: 'DELETE',
        url: /^\/contacts\/([0-9]+)$/,
        run: deleteContact
    },
    {
        method: 'GET',
        url: /^\/contacts\/?$/,
        run: displayAllContacts
    },
    {
        method: 'POST',
        url: /^\/contacts\/?$/,
        run: createNewContact
    },
    {
        method: 'PUT',
        url: /^\/contacts\/([0-9]+)$/,
        run: updateContact
    },
    {
        method: 'GET',
        url: /^.*$/,
        run: noContactsFound
    },
];

let startServer = () => {
    let server = http.createServer((req, res) => {
        let route = routes.find(route => route.url.test(req.url) && req.method === route.method);
        let matches = route.url.exec(req.url);
        route.run(req, res, matches.slice(1));
    });
    server.listen(3000);
};

readPhoneBookFromFile();