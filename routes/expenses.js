const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../db');

// Получить все расходы
router.get('/', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query('SELECT * FROM Expenses');
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка при получении расходов:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавить расход
router.post('/', async (req, res) => {
    const { description, amount, expense_date } = req.body;
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('description', description)
            .input('amount', amount)
            .input('expense_date', expense_date)
            .query('INSERT INTO Expenses (description, amount, expense_date) VALUES (@description, @amount, @expense_date)');
        res.status(201).send('Расход добавлен');
    } catch (err) {
        console.error('Ошибка при добавлении расхода:', err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;
