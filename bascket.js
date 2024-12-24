document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        // Получаем список товаров в корзине из localStorage
        let basket = JSON.parse(localStorage.getItem('basket')) || [];

        // Находим контейнер для товаров в корзине
        const ordersList = document.getElementById('ordersList');

        // Проверяем, что элемент найден
        if (!ordersList) {
            console.error('ordersList not found!');
            return;  // Если элемент не найден, выходим из функции
        }

        // Если в корзине есть товары, отображаем их
        if (basket.length > 0) {
            basket.forEach(product => {
                const li = document.createElement('li');
                li.classList.add('basket-item');
                li.dataset.id = product.id;  // Добавляем data-id для каждой позиции

                li.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="wrapper">
                        <ul class="criterias">
                            <li class="name">${product.name}</li>
                            <li class="price">${product.price}</li>
                            <li class="descr">${product.descr}</li>
                            <li class="color"><p>color:</p> ${product.color}</li>
                            <li class="scent"><p>scent:</p> ${product.scent}</li>
                        </ul>
                        <div class="wrapper__btns">
                            <button class="remove-from-basket" onclick="removeFromBasket(this)">
                                Remove
                            </button>
                        </div>
                    </div>`;

                ordersList.appendChild(li);
            });
        } else {
            ordersList.innerHTML = "<p>Your basket is empty.</p>";
        }
    }, 100); // Задержка в 100 миллисекунд
});

// Функция для добавления товара в корзину
function addToBasket(button) {
    const currentUser = localStorage.getItem("currentUser");

    // Проверяем, если пользователь не авторизован
    if (!currentUser) {
        alert('Please log in to add items to your basket!');
        return;
    }

    const productElement = button.closest('li');
    if (!productElement) {
        console.error("Product element not found!");
        return;
    }

    const id = `product-${Date.now()}`;  // Генерируем уникальный id на основе временной метки
    const name = productElement.querySelector('.name').textContent;
    const image = productElement.querySelector('img').getAttribute('src');
    const price = productElement.querySelector('.price').textContent;
    const descr = productElement.querySelector('.descr').textContent;
    const color = productElement.querySelector('.color').textContent;
    const scent = productElement.querySelector('.scent').textContent.trim();

    // Получаем список товаров в корзине из localStorage
    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    // Проверяем, есть ли уже этот товар в корзине
    const isProductInBasket = basket.some(product => product.id === id);

    if (!isProductInBasket) {
        // Товар еще не в корзине - добавляем его
        basket.push({ id, name, image, price, descr, color, scent });
        localStorage.setItem('basket', JSON.stringify(basket));

        alert('Product added to your basket!');
    } else {
        alert('This product is already in your basket!');
    }
}

// Функция для удаления товара из корзины
function removeFromBasket(button) {
    const productElement = button.closest('li');
    const id = productElement.dataset.id;

    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const index = basket.findIndex(product => product.id === id);

    if (index !== -1) {
        // Удаляем товар из массива
        basket.splice(index, 1);
        localStorage.setItem('basket', JSON.stringify(basket));

        // Убираем товар с экрана
        productElement.remove();

        alert('Product removed from basket!');
    }
}

// Функция для оформления заказа
function placeOrder() {
    setTimeout(function () {
        let basket = JSON.parse(localStorage.getItem('basket')) || [];

        if (basket.length > 0) {
            alert('Your order has been placed!');
            localStorage.removeItem('basket');  // Очищаем корзину
            document.getElementById('ordersList').innerHTML = "<p>Your order has been placed!</p>";
        } else {
            alert('Your basket is empty. Add some items to place an order.');
        }
    }, 100); // Задержка в 100 миллисекунд
}

