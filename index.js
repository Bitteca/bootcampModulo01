const express = require('express');

const server = express();
server.use(express.json());

const users = ['Teste1', 'Teste2', 'Teste3'];

server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  return next();
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Username is required' });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.id];
  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  req.user = user;
  return next();
}

server.get('/users/:id', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.get('/users', (req, res) => {
  return res.json(users);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:id', checkUserExists, checkUserInArray, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  users[id] = name;

  return res.json(users);
});

server.delete('/users/:id', checkUserInArray, (req, res) => {
  const { id } = req.params;
  users.splice(id, 1);

  return res.send();
});

server.listen(3333);
