const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const helmet = require('helmet');
const sha1 = require('sha1');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3001;
const server = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

server.use(helmet({
  frameguard: false
}));

const noCache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  next();
};
server.use(cookieParser());
server.use(bodyParser.json());
server.use('/static', noCache, express.static(path.join(__dirname, '/build/static')));

server.use('/favicon.ico', express.static(path.join(__dirname, '/build/favicon.ico')));

server.get('/api/status/:id', (req, res) => {
  axios.get(process.env.SERVER_URL + '/application/status/' + req.params.id)
    .then(response => res.json(response.data))
    .catch(err => console.error(err))
});

server.get('/api/information/:id', (req, res) => {
  axios.get(process.env.SERVER_URL + '/application/information/' + req.params.id)
    .then(response => res.json(response.data))
    .catch(err => console.error(err))
});

server.post('/api/update/:id', (req, res) => {
  axios.put(process.env.SERVER_URL + '/heroku/resources/' + req.params.id, {
    update_timer: true,
    new_timer: req.body.timeout
  })
    .then(response => res.json({ saved: true }))
    .catch(err => res.sendStatus(500).json({error: true, errorMessage: 'FAILED_TO_UPDATE'}))
});

server.post('/auth/login', urlencodedParser, (req, res) => {
  const data = req.body;
  const preToken = data.id + ':' + process.env.SALT + ':' + data.timestamp;
  const token = sha1(preToken);

  if (token !== data.token) {
    res.sendStatus(403);
  } else if (data.timestamp < (new Date().getTime()/1000 - 2*60)) {
    res.sendStatus(403);
  } else {
    res.cookie('id', data.resource_id, {
      session: true,
      httpOnly: true,
      secure: true
    });

    res.cookie('heroku-nav-data', data["nav-data"], {
      session: true,
      httpOnly: true,
      secure: true
    });

    res.redirect('https://stopngo-pages.herokuapp.com/dashboard/' + data.resource_id);
  }
});

server.use('/dashboard/:id', (req, res, next) => {
  if (req.cookies.id !== req.params.id) res.sendStatus(403);
  else next();
});

server.use('*', noCache, express.static(path.join(__dirname, '/build')));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

