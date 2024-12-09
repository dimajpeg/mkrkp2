const express = require('express');
const path = require('path');
const { getDbConnection } = require('./db');
const productsRouter = require('./routes/products');  // Подключаем роут для работы с продуктами

const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обслуживание статических файлов (CSS, JS, изображения)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});


// Страница для управления товарами
app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

// Использование маршрутов для работы с товарами
app.use('/products', productsRouter);

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
