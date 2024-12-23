document.addEventListener("DOMContentLoaded", function () {
    // Получаем список избранных товаров из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Находим контейнер для избранных товаров
    const favoritesList = document.getElementById('favoritesList');

    // Если в избранном есть товары, отображаем их
    if (favorites.length > 0) {
        favorites.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('favorite-item');
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
                        <button class="remove-from-favorites" onclick="removeFromFavorites(this)">
                            Remove
                        </button>
                        <button class="bascket">Add to orders</button>
                    </div>
                </div>`;


            favoritesList.appendChild(li);
        });
    } else {
        favoritesList.innerHTML = "<p>В избранном еще нет товаров.</p>";
    }
});

// Функция для удаления товара из избранного
function removeFromFavorites(button) {
    const productElement = button.closest('li');
    const id = productElement.dataset.id;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(product => product.id === id);

    const isProductInFavorites = favorites.some(product => product.id === id);

    if (index !== -1) {
        favorites.splice(index, 1);  // Удаляем товар из массива
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Убираем товар с экрана
        productElement.remove();
        alert('Товар удален из избранного!');
    }
}
