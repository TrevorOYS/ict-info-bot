require('dotenv').config();

const axios = require("axios");
const MY_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

module.exports = axiosInstance;