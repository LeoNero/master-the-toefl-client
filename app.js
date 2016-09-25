'use strict'

const express         = require('express');
const path            = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/.')));
app.set('port', process.env.PORT || 9000);

app.get('/', (req, res) => {
  res.render('index.html');
})

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
