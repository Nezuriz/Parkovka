import { verifyJWT } from '../utils/token.js';

export const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Akses ditolak. Token tidak ditemukan.' 
    });
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Token tidak valid atau sudah kedaluwarsa.' 
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: `Akses ditolak. Fitur ini khusus untuk role: ${allowedRoles.join(', ')}.` 
      });
    }
    next();
  };
};

export const isAdmin = authorizeRoles('admin');
export const isPetugas = authorizeRoles('petugas');