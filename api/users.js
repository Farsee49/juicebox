const express = require('express');
const usersRouter = express.Router();
usersRouter.use(express.json());
const { requireUser } = require('./utils');

const { 
    getAllUsers, 
    getUserByUsername,
    createUser,
    getUserById,
    updateUser
   } = require('../db');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users!");
  next();
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.send({
    users
  });
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  };
  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      const token = jwt.sign({
        id: user.id, 
        username: user.username, 
        password: user.password 
      }, process.env.JWT_SECRET);
      res.send({ message: "you're logged in!", token: token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    };
  } catch(error) {
    console.log(error);
    next(error);
  };
});

usersRouter.post('/register', async (req, res, next) => {
console.log(req.body)

  const { username, password, name, location } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    };
    const user = await createUser({
      username,
      password,
      name,
      location,
    });
    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });
    res.send(`<h1>REG</h1>`,{ 
      message: "thank you for signing up",
      token 
    });
  } catch ({ name, message }) {
    next({ name, message });
  }; 
});

usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
    try {
      const post = await getUserById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedUser = await updateUser(user.id, { active: false });
  
        res.send({ user: updatedUser });
      } else {
        // if there was a user, throw UnauthorizedUserError, otherwise throw UserNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a user which is not yours"
        } : {
          name: "UserNotFoundError",
          message: "That user does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = usersRouter;

