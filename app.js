const express = require('express')
const app = express()
const port = 3000
var path = require('path');
ejs = require('ejs');
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

function Arango() {
    Database = require('arangojs').Database;


    db = new Database('http://127.0.0.1:8529');
    db.useBasicAuth('root', '')
    db.useDatabase('MyDb');
    return db.collection('MyCollection');
}

app.get('/', (req, res) => {
    let collection = Arango()
    collection.all().then(
        async cursor => {
            cursor = await cursor.map(doc => doc)
            console.log(cursor)
            res.render('../index.ejs', {
                cursor: cursor
            });
        }
    )

})

app.get('/delete', (req, res) => {
    Arango()
    let collection = Arango()
    console.log(req.query.id)
    collection.remove(req.query.id).then(
        () => console.log('Document removed'));

    res.redirect('/');
})

app.post('/create', (req, res) => {
    Arango()
    console.log(req.body)
    let collection = Arango()
    doc = {
        _key: req.body._key,
        value: req.body.value
    };

    collection.save(doc)
    res.redirect('/');
})

app.post('/edit', (req, res) => {
    Arango()
    console.log(req.body)
    let collection = Arango()
    collection.update(req.body._key, {
        _key: req.body._key,
        value: req.body.value
    })
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})