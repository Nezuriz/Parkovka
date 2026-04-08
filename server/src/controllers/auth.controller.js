import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Username dan password wajib diisi' 
      });
    }
    const result = await authService.loginUser(username, password);
    res.cookie('jwt', result.token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: 'lax', 
    });
    res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        user: result.user
      }
    });
  } catch (error) {
    res.status(401).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat logout'
    })
  }
};