require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    username: process.env.DB_USERNAME,
    password: '',
    database: process.env.DB_NAME,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    }
}