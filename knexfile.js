module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/passport-basic'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
