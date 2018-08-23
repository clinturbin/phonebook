const express = require('express');
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

let displayOneContact = (req, res) => {
    let contactId = req.params.id;
    db.one(`SELECT name, phone
            FROM contacts
            WHERE contacts.id = '${contactId}';`
        ).then((results) => {
            let resultDisplay = `${results.name}: ${results.phone}`;
            res.end(resultDisplay);
    });
};

let deleteContact = (req, res) => {
    let contactId = req.params.id;
    db.one(`DELETE FROM contacts
            WHERE contacts.id = '${contactId}';`).then(res.end(`Entry Removed`));
};

let createNewContact = (req, res) => {

    readBody(req, (contact) => {
        let randomId = generateRandomID();
        db.query(`INSERT INTO contacts (id, name, phone, address, email
                  VALUES (id, name, phone, address, email;`).then
        // contact.id = randomId;
        // contacts[randomId] = contact;
        // fs.writeFile("phone-book.txt", JSON.stringify(contacts), (error) => {
        //     res.end(JSON.stringify(contact));
        // });
    });
};

let updateContact = (req, res) => {
    let contactId = req.params.id;
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

let server = express();

server.get('/contacts', displayAllContacts);
server.post('/contacts', createNewContact);
server.get('/contacts/:id', displayOneContact);
server.delete('/contacts/:id', deleteContact);
server.put('/contacts/:id', updateContact);
server.put(/^.*$/, noContactsFound);

server.listen(3000);