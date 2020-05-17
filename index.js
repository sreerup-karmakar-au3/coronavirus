const express = require('express')

const app = express()

app.use(express.static('public'));
app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
})

app.get('/details', (req, res) => {
    res.render('country.hbs', {
        style: "/country.css",
        script: "/country.js",
        loading: '/loading.gif'
    });
});

app.listen(process.env.PORT || 3000);