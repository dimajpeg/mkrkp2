window.onload = function () {
    fetch('/products')  // Ваш API маршрут для получения списка продуктов
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const productsList = document.getElementById('products-list');
            const ul = document.createElement('ul');  // Создаем список для отображения товаров

            // Проходим по каждому товару и отображаем информацию
            data.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${product.name}</strong><br>
                    Цена: ${product.price} грн.<br>
                    Количество на складе: ${product.remaining_quantity} шт.<br>
                    <button onclick="showDescription(${product.product_id})">Подробнее</button>
                `;
                ul.appendChild(li);
            });

            productsList.appendChild(ul);  // Добавляем список в HTML
        })
        .catch(err => console.error('Ошибка при загрузке товаров:', err));  // Обработка ошибок
};

// Функция для перенаправления на страницу с подробным описанием товара
function showDescription(id) {
    window.location.href = `product.html?id=${id}`;
}
