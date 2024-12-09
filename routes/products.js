const sql = require('mssql');
const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../db');

// Получить все продукты с расчетом остаточного количества
router.get('/', async (req, res) => {
    try {
        const pool = await getDbConnection();

        const query = `
            SELECT 
                p.id AS product_id, 
                p.name, 
                p.stock AS price, 
                COALESCE(SUM(s.quantity), 0) AS total_supplied,
                COALESCE(SUM(e.quantity), 0) AS total_expensed,
                (COALESCE(SUM(s.quantity), 0) - COALESCE(SUM(e.quantity), 0)) AS remaining_quantity
            FROM Products p
            LEFT JOIN Supplies s ON p.id = s.product_id
            LEFT JOIN Expenses e ON p.id = e.product_id
            GROUP BY p.id, p.name, p.stock
        `;

        const result = await pool.request().query(query);

        // Логирование данных перед отправкой
        console.log('Полученные данные о продуктах:', result.recordset);

        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка при получении данных о продуктах:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавить новый товар
router.post('/', async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
        return res.status(400).send('Все поля обязательны');
    }

    try {
        const pool = await getDbConnection();
        const query = `
            INSERT INTO Products (name, stock, quantity)
            VALUES (@name, @price, @quantity)
        `;
        await pool.request()
            .input('name', name)
            .input('price', price)
            .input('quantity', quantity)
            .query(query);

        res.send('Товар добавлен успешно!');
    } catch (err) {
        console.error('Ошибка при добавлении товара:', err);
        res.status(500).send('Ошибка при добавлении товара');
    }
});

// Получить товар по ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const pool = await getDbConnection();
        const query = `
            SELECT id, name, stock FROM Products WHERE id = @productId
        `;

        const result = await pool.request()
            .input('productId', sql.Int, productId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('Товар не найден');
        }

        res.json(result.recordset[0]); // Возвращаем товар
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).send('Ошибка сервера');
    }
});


// Удалить товар
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const pool = await getDbConnection();
        const query = `
            DELETE FROM Products
            WHERE id = @id
        `;
        await pool.request()
            .input('id', productId)
            .query(query);

        res.send('Товар удален успешно!');
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        res.status(500).send('Ошибка при удалении товара');
    }
});

// Обновить товар

router.put('/:id', async (req, res) => {
    try {
        const { name, price } = req.body;  // price это stock
        const productId = req.params.id;

        const pool = await getDbConnection();
        const query = `
            UPDATE Products
            SET name = @name, stock = @price  // Обновляем stock, а не price
            WHERE id = @productId
        `;

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('price', sql.Decimal, price) // Обновление stock
            .input('productId', sql.Int, productId)
            .query(query);

        res.send('Продукт обновлен успешно');
    } catch (err) {
        console.error('Ошибка при обновлении товара:', err);
        res.status(500).send({ error: 'Ошибка сервера', details: err.message });
    }
});



module.exports = router;

