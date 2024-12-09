document.addEventListener("DOMContentLoaded", function() {
    const productsTable = document.getElementById("productsTable").getElementsByTagName('tbody')[0];

    function loadProducts() {
        fetch('/products')  // Запрос на сервер для получения данных о товарах
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                console.log('Полученные продукты:', products); // Логирование полученных данных

                productsTable.innerHTML = ''; // Очистка таблицы

                products.forEach(product => {
                    console.log(`Обрабатываем продукт: ${product.name}, Остаток: ${product.remaining_quantity}`);

                    const row = productsTable.insertRow();
                    row.innerHTML = `
                        <td>${product.product_id}</td>
                        <td>${product.name}</td>
                        <td>${product.stock}</td>
                        <td>${product.remaining_quantity}</td>
                        <td><button>Удалить</button></td>
                    `;
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки товаров:', error);
            });
    }

    loadProducts();  // Загружаем товары при загрузке страницы
});
