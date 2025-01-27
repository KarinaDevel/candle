document.querySelector('.burger-menu').addEventListener('click', function() {
    // Переключение состояния бургер-меню и анимации
    this.classList.toggle('active');
    // Переключение видимости меню
    document.querySelector('ul').classList.toggle('active');
});

let users = [];

if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
}

// Местоположение для отображения состояния (находится в header)
const loggedInContainer = document.querySelector(".headbar ul");

// Логика для открытия формы регистрации
let singInWind;
let loginForm;

document.addEventListener('DOMContentLoaded', () => {
    // Теперь элементы инициализируются после загрузки DOM
    singInWind = document.getElementById("singInContr");
    loginForm = document.getElementById("loginForm");
});

// Логика для открытия формы регистрации
function openSingIn() {
    singInWind.style.display = "flex";
    loginForm.style.display = "none"; // Закрыть форму входа, если открывается регистрация
}

// Логика для открытия формы логина
function openLogInForm() {
    loginForm.style.display = "flex";
    singInWind.style.display = "none"; // Закрыть форму регистрации, если открывается логин
}

// Логика для регистрации пользователя
function addUser() {
    const nameInp = document.getElementById("nameInp");
    const emailInp = document.getElementById("email");
    const passwordInp = document.getElementById("password");

    const name = nameInp.value.trim();
    const email = emailInp.value.trim();
    const password = passwordInp.value.trim();

    // Проверка заполнения всех полей
    if (!name || !email || !password) {
        alert("Fill the fields");
        return;
    }

    // Проверка корректности email
    if (!(email.includes('@') && email.includes('.'))) {
        emailInp.style.backgroundColor = 'rgba(228, 72, 72, 0.422)';
        emailInp.style.border = '1px solid red';
        emailInp.setAttribute('placeholder', 'Write the email in the correct format');
        emailInp.value = '';
        return;
    }

    // Проверка на существование такого пользователя
    if (users.find(user => user.email === email)) {
        alert("This email is already registered!");
        return;
    }

    // Добавляем нового пользователя
    users.push({
        name,
        password,
        email,
        cart: [],       // Корзина
        favorites: []   // Избранное
    });

    // Сохраняем пользователей в localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Очищаем поля ввода
    nameInp.value = '';
    passwordInp.value = '';
    emailInp.value = '';
    alert('Registration successful!');
    singInWind.style.display = "none"; // Закрыть форму после регистрации
}

// Логика для входа пользователя
function logIn() {
    const emailInp = document.getElementById("emailInpLogin");
    const passwordInp = document.getElementById("passwordInpLogin");

    const email = emailInp.value.trim();
    const password = passwordInp.value.trim();

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Пользователь найден, сохраняем в localStorage как текущего пользователя
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Очищаем поля ввода
        emailInp.value = '';
        passwordInp.value = '';

        alert(`Welcome, ${user.name}!`);
        updateUIAfterLogin(user); // Обновляем UI после входа
    } else {
        alert("Invalid credentials");
    }
}

// Функция для обновления UI после входа
function updateUIAfterLogin(user) {
    if (loggedInContainer) { // Проверяем, существует ли элемент
        loggedInContainer.innerHTML = `
            <li><button onclick="logOut()">Log out</button></li>
            <li><a href="favorites.html" class="like" id="like">
                    <p>Favorites</p>
                    <img src="svgs/like.svg" alt="like">
                </a>
                
            </li>
            <li>
                <a href="bascket.html" class="order-bascket" id="order-bascket">
                    <p>Orders</p>
                    <img src="svgs/bascket.svg" alt="bascket">
                </a>
                
            </li>
        `;
    }
}

// Функция для выхода из аккаунта
function logOut() {
    localStorage.removeItem("currentUser");
    updateUIForLogout();
}

// Функция для обновления UI, если пользователь не вошел
function updateUIForLogout() {
    if (loggedInContainer) {
        loggedInContainer.innerHTML = `
            <li><button onclick="openLogInForm()">Log In</button></li>
            <li><button onclick="openSingIn()">Sign Up</button></li>
        `;
    }
}

// Инициализация UI при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateUIAfterLogin(user);
    } else {
        updateUIForLogout();
    }
});
// Добавление в избранное
function addToFavorites(button) {
    // Проверка, если пользователь не авторизован
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Please log in to add products to favorites.");
        return; // Прерываем выполнение, если пользователь не авторизован
    }

    const productElement = button.closest('li');

    // Проверяем, что элемент был найден
    if (!productElement) {
        console.error("Product element not found!");
        return;
    }

    const heartIcon = button.querySelector('.heart');  // Иконка сердца

    // Генерируем уникальный id на основе временной метки
    const id = `product-${Date.now()}`;

    const name = productElement.querySelector('.name').textContent;
    const image = productElement.querySelector('img').getAttribute('src');
    const descr = productElement.querySelector('.descr').textContent;

    // Получаем опции из селектов, с проверками на существование
    const priceOptions = productElement.querySelector('.price select') 
        ? Array.from(productElement.querySelector('.price select').children).map(option => option.textContent.trim()) 
        : ["not specified"]; // Если селект пуст, добавляем "not specified"
    const colorOptions = productElement.querySelector('.color select') 
        ? Array.from(productElement.querySelector('.color select').children).map(option => option.textContent.trim()) 
        : ["not specified"]; // Если селект пуст, добавляем "not specified"
    const scentDescriptions = Array.from(productElement.querySelectorAll('.scent .down-space')).map(desc => desc.textContent.trim());
    const scentOptions = productElement.querySelector('.scent select') 
        ? Array.from(productElement.querySelector('.scent select').children).map(option => option.textContent.trim()) 
        : ["not specified"]; // Если селект пуст, добавляем "not specified"

    // Получаем список избранных товаров из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Проверяем, есть ли уже этот товар в избранном
    const isProductInFavorites = favorites.some(product => product.name === name && product.price === priceOptions[0]);

    if (heartIcon && heartIcon.src.includes("like-red.svg")) {
        alert('This product is already in your favorites!');
        return;  // Прерываем выполнение, чтобы товар не добавился снова
    }

    if (!isProductInFavorites) {
        // Товар еще не в избранном - добавляем его в начало массива
        favorites.unshift({
            id,
            name,
            image,
            descr,
            priceOptions,
            colorOptions,
            scentDescriptions,
            scentOptions
        });

        // Сохраняем данные в localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Меняем цвет сердца на красный
        if (heartIcon) {
            heartIcon.src = "svgs/like-red.svg"; // Путь к изображению красного сердца
        }

        alert('Product added to favorites!');
    }
}




// Инициализация состояния кнопок при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Находим все кнопки "like" на странице
    const likeButtons = document.querySelectorAll('.like');

    likeButtons.forEach(button => {
        const productElement = button.closest('li');
        const heartIcon = button.querySelector('.heart');  // Иконка сердца

        // Проверяем, что найден productElement и heartIcon
        if (!productElement || !heartIcon) {
            return;  // Если одного из элементов нет, пропускаем итерацию
        }

        const nameElement = productElement.querySelector('.name');
        const priceElement = productElement.querySelector('.price');
        const descrElement = productElement.querySelector('.descr');
        const colorElement = productElement.querySelector('.color');
        const scentElement = productElement.querySelector('.scent');

        if (!nameElement || !priceElement || !descrElement || !colorElement || !scentElement) {
            console.error("One or more product details are missing");
            return;
        }

        const name = nameElement.textContent;
        const price = priceElement.textContent;
        const descr = descrElement.textContent;
        const color = colorElement.textContent;
        const scent = scentElement.textContent.trim();

        const isProductInFavorites = favorites.some(product =>
            product.name === name &&
            product.price === price &&
            product.scent === scent
        );

        if (isProductInFavorites) {
            heartIcon.src = "svgs/like-red.svg";  // Меняем на красное сердце
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Ваш код добавления обработчиков событий
    document.querySelectorAll('.scent select').forEach(select => {
        select.addEventListener('change', function () {
            // Логика изменения описания запаха
        });
    });
});
