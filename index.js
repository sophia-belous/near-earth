const express = require('express');
const path = require('path');
const app = express();

app.set('port', (process.env.PORT || 2017));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname + 'prod')));

app.set('views', __dirname + '/app/pages');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => res.render('index'));

app.all('/*', (req, res) => res.sendFile('index.html', { root: __dirname }));

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')));
