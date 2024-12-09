window.onload = function () {
    loadProducts();

    // Обработчик для добавления нового товара
    const form = document.getElementById('add-product-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const quantity = document.getElementById('product-quantity').value;

        const product = {
            name,
            price,
            quantity
        };

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                loadProducts();
            })
            .catch(err => console.error('Ошибка при добавлении товара:', err));
    });

    // Обработчик для редактирования товара
    const editForm = document.getElementById('edit-product-form');
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = document.getElementById('edit-product-id').value;
        const name = document.getElementById('edit-product-name').value;
        const price = document.getElementById('edit-product-price').value;

        const updatedProduct = {
            name,
            price
            // Не отправляем quantity
        };

        fetch(`/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                loadProducts();
                editForm.style.display = 'none'; // Скрыть форму после обновления
            })
            .catch(err => console.error('Ошибка при обновлении товара:', err));
    });
};

// Загрузка списка товаров
function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Очищаем список перед обновлением

    fetch('/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${product.name} - ${product.price} грн. - ${product.remaining_quantity} шт.
                    <button onclick="deleteProduct(${product.product_id})">Удалить</button>
                    <button onclick="editProduct(${product.product_id})">Изменить</button>
                `;
                productList.appendChild(li);
            });
        })
        .catch(err => console.error('Ошибка при загрузке товаров:', err));
}

// Удаление товара
function deleteProduct(id) {
    fetch(`/products/${id}`, { method: 'DELETE' })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadProducts();
        })
        .catch(err => console.error('Ошибка при удалении товара:', err));
}

// Открытие формы редактирования товара
function editProduct(id) {
    fetch(`/products/${id}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    // В случае ошибки, возвращаем текстовую ошибку
                    throw new Error(`Ошибка: ${text}`);
                });
            }
            return response.json();
        })
        .then(product => {
            document.getElementById('edit-product-id').value = product.product_id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-form').style.display = 'block'; // Показываем форму редактирования
        })
        .catch(err => {
            console.error('Ошибка при получении товара для редактирования:', err);
            alert('Ошибка при получении товара: ' + err.message); // Показываем ошибку пользователю
        });
}
