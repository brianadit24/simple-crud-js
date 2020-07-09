const model = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
  const {
    name,
    label,
    picture,
    email,
    phone,
    website,
    summary,
    password,
  } = req.body;
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  try {
    const user = model.User.create({
      name,
      label,
      picture,
      email,
      phone,
      website,
      summary,
      password: hash,
    });
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
}

async function readUser(req, res) {
  try {
    const user = await model.User.findAll();
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
}

async function updateUser(req, res) {
  const { name, label, picture, email, phone, website, summary } = req.body;
  const decodedId = req.decoded.id;
  try {
    const isValidUser = Number(decodedId) === Number(req.params.id);

    if (!isValidUser) {
      throw new Error('Ini bukan data anda');
    }

    const user = await model.User.update(
      {
        name,
        label,
        picture,
        email,
        phone,
        website,
        summary,
        // password: hash,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
        plain: true,
      }
    );
    res.json(`Berhasil menghapus user dengan id ${user}`);
  } catch (error) {
    res.json({ error });
  }
}

async function deleteUser(req, res) {
  const decodedId = req.decoded.id;
  try {
    const isValidUser = Number(decodedId) === Number(req.params.id);
    if (!isValidUser) {
      throw new Error('Ini bukan data anda');
    }
    const user = await model.User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(`Berhasil menghapus user dengan id ${user}`);
  } catch (error) {
    res.json({ error });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await model.User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('Email atau password salah');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Email atau password salah');
    }
    res.json({
      message: 'Berhasil login',
      token: jwt.sign({ id: user.id }, 'Brian-Dev'),
    });
  } catch (error) {
    res.json(error);
  }
}

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  loginUser,
};
