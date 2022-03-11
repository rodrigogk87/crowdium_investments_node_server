const express = require('express');
const app = express();

const userRoute = require('./api/routes/user');
const investmentRoute = require('./api/routes/investment');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoute);
app.use('/investment', investmentRoute);

app.use((req, res, next) => {
    res.status(404).json({
        error: 'bad request'
    })
})

module.exports = app;