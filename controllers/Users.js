import Users from "../models/userModel.js";
import argon2 from "argon2"; // import depedencies untuk hashing password

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      // instruksi untuk hanya menampilkan attributes yang di minta
      attributes: ["uuid", "name", "email", "roles"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["uuid", "name", "email", "roles"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUsers = async (req, res) => {
  const { name, email, password, confPassword, roles } = req.body;
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Password dan Confirm Password Tidak Cocok, Mohon Diulangi.",
    });
  const hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      roles: roles,
    });
    res.status(201).json({ msg: "Register telah berhasil!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user)
    return res.status(404).json({ msg: "User tidak dapat ditemukan!" });
  const { name, email, password, confPassword, roles } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Password dan Confirm Password Tidak Cocok, Mohon Diulangi.",
    });
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        roles: roles,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user)
    return res.status(404).json({ msg: "User tidak dapat ditemukan!" });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
