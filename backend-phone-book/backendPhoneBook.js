const http = require('http');
const fs = require('fs');
const pg = require('pg-promise')();
const dbConfig = 'postgres://clint@localhost:5432/phonebook';
const db = pg(dbConfig);


let generateRandomID = () => Math.floor(Math.random() * 100000).toString();


let displayAllContacts = (req, res, matches) => {
    db.query('select * from contacts;').then((results) => {
        res.end(JSON.stringify(results));
    });
};

let displayOneContact = (req, res, matches) => {
    let contactId = matches[0];
    db.one(`SELECT name, phone
            FROM contacts
            WHERE contacts.id = '${contactId}';`
        ).then((results) => {
            let resultDisplay = `${results.name}: ${results.phone}`;
            res.end(resultDisplay);
    });
};

let deleteContact = (req, res, matches) => {
    let contactId = matches[0];
    db.one(`DELETE FROM contacts
            WHERE contacts.id = '${contactId}';`).then(res.end(`Entry Removed`));
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
        contacts[contactId]['address'] = contact['address'];
        contacts[contactId]['email'] = contact['email'];
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

let server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('frontend/index.html', (error, data) => {
            res.end(data);
        });
    } else if (req.url === '/index.js') {
        fs.readFile('frontend/index.js', (error, data) => {
            res.end(data);
        });
    } else {
        let route = routes.find(route => route.url.test(req.url) && req.method === route.method);
        let matches = route.url.exec(req.url);
        route.run(req, res, matches.slice(1));
    }
});
server.listen(3000);