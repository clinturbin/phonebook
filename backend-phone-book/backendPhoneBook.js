const express = require('express');
const fs = require('fs');
const pg = require('pg-promise')();
const dbConfig = 'postgres://clint@localhost:5432/phonebook';
const db = pg(dbConfig);


let generateRandomID = () => Math.floor(Math.random() * 100000).toString();


let displayAllContacts = (req, res) => {
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
    db.query(`DELETE FROM contacts
              WHERE contacts.id = '${contactId}';`
            ).then(res.end(`Entry Removed`));
};

let createNewContact = (req, res) => {
    readBody(req, (contact) => {
        let randomId = generateRandomID();
        db.query(`INSERT INTO contacts (id, name, phone, address, email) VALUES 
                 ('${randomId}', '${contact['name']}', '${contact['phone']}', 
                  '${contact['address']}', '${contact['email']}');`
                ).then(res.end(`Entry Added`))
    });
};

let updateContact = (req, res) => {
    readBody(req, (contact) => {
        let contactId = req.params.id;
        db.query(`UPDATE contacts 
                  SET name = '${contact['name']}', phone = '${contact['phone']}', 
                      address = '${contact['address']}', email = '${contact['email']}'
                  WHERE contacts.id = '${contactId}';`
                ).then(res.end(`Entry Updated`))
    });
};

let homepage = (req, res) => {
    fs.readFile('frontend/index.html', (err, data) => {
        res.end(data);
    })
};

let javascript = (req, res) => {
    fs.readFile('frontend/index.js', (err, data) => {
        res.end(data);
    })
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

let server = express();

server.get('/', homepage);
server.get('/index.js', javascript);
server.get('/contacts', displayAllContacts);
server.post('/contacts', createNewContact);
server.get('/contacts/:id', displayOneContact);
server.delete('/contacts/:id', deleteContact);
server.put('/contacts/:id', updateContact);
server.get('*', noContactsFound);

server.listen(3000);