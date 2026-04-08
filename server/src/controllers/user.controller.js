import * as userService from '../services/user.service.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ status: 'success', message: 'User berhasil dibuat' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateExistingUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'User berhasil diupdate' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ status: 'success', message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};