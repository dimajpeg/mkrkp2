const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const suppliesRouter = require('./routes/supplies');
const expensesRouter = require('./routes/expenses');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршруты
app.use('/products', productsRouter);
app.use('/supplies', suppliesRouter);
app.use('/expenses', expensesRouter);

// Главная страница
app.get('/', (req, res) => {
    res.send('Добро пожаловать в систему управления складом!');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
