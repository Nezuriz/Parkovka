import bcrypt from 'bcrypt';

// Fungsi untuk melakukan hashing password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Fungsi untuk mengecek password saat login nanti
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};