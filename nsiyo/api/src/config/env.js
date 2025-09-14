export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nsiyo',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((o) => o.trim()),
  cookieSecure: (process.env.COOKIE_SECURE || 'false') === 'true',
  adminEmail: process.env.ADMIN_EMAIL,
}

