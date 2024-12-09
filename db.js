const sql = require('mssql');

// Строка подключения
const connectionString = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost,3717;DATABASE=SpaShop;UID=KPP;PWD=12345678;Encrypt=True;TrustServerCertificate=True;';

// Функция для получения подключения к базе данных
async function getDbConnection() {
    try {
        const pool = await sql.connect(connectionString);
        console.log('Подключение к базе данных успешно.');
        return pool; // Возвращаем подключение для использования в других частях приложения
    } catch (err) {
        console.error('Ошибка подключения к базе данных:', err);
        throw err;
    }
}

module.exports = { sql, getDbConnection };
