const express = require('express');   // http://expressjs.com/en/4x/api.html
const hbs = require('hbs'); // handlebars
const fs = require('fs');

// UWAGA 1
// Folder "views" to domyślny folder z którego czyta Express przy funkcji "render"

var app = express();

hbs.registerPartials(__dirname + '/views/partiatls');
app.set('view engine', 'hbs');
// app.use -> rejestruje Express middleware czyli funkcje
//
//
// tu rejestrujemy funkcje middleware które są wywoływane w kolejności definicji zanim wywoływane są "get".
// jak middleware skończy to TRZEBA wywołać "next()" aby Express dalej wykonał się do końca wywołania
// pierwsza funkcja middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Bład zapisu do server.log');
        }
    });
    next(); // wskazuje że Express ma dalej procedować z wywołaniami (np. "get")
});

// DRUGA funkcja maintenance- uruchamiana po pierwszej jeśli tam bedzie "next()"
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maintenance Page'
//     });
//  // ta funkcja nie wywołuje NEXT a więc zatrzymuje egzekucję strony. Np. z powodu awarii.
// });

// trzecia funkcja middleware
// Za pomocą tej funkcji definiujemy statyczne elementy strony które będą podane jeśli ktoś wywoła plik znajdujący się w "/public" (np. help.html)
// Umieszczenie tego tutaj (pod "maintenance.hbs") spowoduje że jeśli "maintenance" zatrzyma uruchomienie strony to również user nie pobierze
// treści statycznych. Bo kolejność "app.use" MA ZNACZENIE !
app.use(express.static(__dirname + '/public'));  // wskazujemy z którego folderu pobierać pliki: http://localhost:3000/help.html


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name:'Michał',
    //     likes:['rower', 'kompek']
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Witaj świecie!'
    });
});

app.get('/about', (req, res) => {
    //res.send('<h1>About!</h1>');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Błąd serwera!'
    });
});

app.listen(3000, () => {
    console.log('Serwer uruchomiony na porcie: 3000');
});