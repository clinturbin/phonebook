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
    http.createServer(function (req, res) {
        if (req.url === '/contacts' && req.method === 'GET') {
            res.end(listAllContacts());
        } else {
            res.end('404 no hobbit found');
        }
    }).listen(3000);
};

var listAllContacts = function () {
    return JSON.stringify(contacts);
};

readPhoneBookFromFile();