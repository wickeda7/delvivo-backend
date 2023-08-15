module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "m+oMHizgnJWQMEQ0dLQlOA=="),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "vcwhC8tBt5maN82nKrKoNQ=="),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "ysxaZg1Am2188GzHVgeh1g=="),
    },
  },
});
