document.addEventListener("DOMContentLoaded", function () {
    // Получаем список избранных товаров из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Находим контейнер для избранных товаров
    const favoritesList = document.getElementById('favoritesList');

    // Если в избранном есть товары, отображаем их
    if (favorites.length > 0) {
        // Очищаем список, чтобы не дублировались товары
        favoritesList.innerHTML = "";

        // Перебираем все товары в избранном
        favorites.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('favorite-item');
            li.dataset.id = product.id;  // Добавляем data-id для каждой позиции

            // Извлекаем данные из объекта товара
            const priceOptions = product.priceOptions || [];
            const colorOptions = product.colorOptions || [];
            const scentDescriptions = product.scentDescriptions || [];
            const scentOptions = product.scentOptions || [];

            // Вставляем HTML для каждого товара
            li.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="wrapper">
                    <ul class="criterias">
                        <li class="name">${product.name}</li>
                        <li class="price">
                            <select name="" id="" class="price">
                                ${priceOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </li>
                        <li class="descr">${product.descr}</li>
                        <li class="color">
                            <p class="color">color:</p>
                            <select name="" id="">
                                ${colorOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </li>
                        <li class="scent">
                            <p class="scent-label">scents:</p>
                            ${scentDescriptions.map(description => `<p class="down-space">${description}</p>`).join('')}
                            <div class="scents__contain">
                                <label class="scent-label">Your choice:</label>
                                <select name="" id="">
                                    ${scentOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>
                            </div>
                        </li>
                    </ul>
                    <div class="wrapper__btns">
                        <button class="remove-from-favorites" onclick="removeFromFavorites(this)">Remove</button>
                        <button class="bascket" onclick="addToBasket(this)">Add to orders</button>
                    </div>
                </div>
            `;

            // Добавляем товар в начало списка
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

    // Получаем список избранных товаров из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Находим индекс товара по id
    const index = favorites.findIndex(product => product.id === id);

    if (index !== -1) {
        // Удаляем товар из массива
        favorites.splice(index, 1);

        // Обновляем список в localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Убираем товар с экрана
        productElement.remove();

        alert('Product removed from favorites!');
    }
}
