const express = require('express')

const app = express()

app.use(express.static('public'));
app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.render('home.hbs', {
        logo: '/logo.png',
        style: "/home.css",
        script: "/home.js"
    });
})

app.get('/details', (req, res) => {
    res.render('country.hbs', {
        logo: '/logo.png',
        style: "/country.css",
        script: "/country.js",
        loading: '/loading.gif'
    });
});

app.listen(process.env.PORT || 3000);