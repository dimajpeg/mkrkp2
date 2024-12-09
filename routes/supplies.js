const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../db');

// Получить все поставки
router.get('/', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query('SELECT * FROM Supplies');
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка при получении поставок:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавить поставку
router.post('/', async (req, res) => {
    const { product_id, quantity, supply_date, supplier } = req.body;
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('product_id', product_id)
            .input('quantity', quantity)
            .input('supply_date', supply_date)
            .input('supplier', supplier)
            .query('INSERT INTO Supplies (product_id, quantity, supply_date, supplier) VALUES (@product_id, @quantity, @supply_date, @supplier)');
        res.status(201).send('Поставка добавлена');
    } catch (err) {
        console.error('Ошибка при добавлении поставки:', err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;
