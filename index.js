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
    const price = productElement.querySelector('.price').textContent;
    const descr = productElement.querySelector('.descr').textContent;
    const color = productElement.querySelector('.color').textContent;
    const scent = productElement.querySelector('.scent').textContent.trim();

    // Получаем список избранных товаров из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Проверяем, есть ли уже этот товар в избранном
    const isProductInFavorites = favorites.some(product => product.name === name && product.price === price);

    if (heartIcon && heartIcon.src.includes("like-red.svg")) {
        alert('This product is already in your favorites!');
        return;  // Прерываем выполнение, чтобы товар не добавился снова
    }

    if (!isProductInFavorites) {
        // Товар еще не в избранном - добавляем его в начало массива
        favorites.unshift({ id, name, image, price, descr, color, scent });
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Меняем цвет сердца на красный
        if (heartIcon) {
            heartIcon.src = "svgs/like-red.svg"; // Путь к изображению красного сердца
        }

        alert('Product added to favorites!');
    }
    // } else {
    //     // Товар уже в избранном - удаляем его
    //     favorites = favorites.filter(product => product.name !== name || product.price !== price || product.scent !==scent); // Удаляем товар по имени и цене
    //     localStorage.setItem('favorites', JSON.stringify(favorites));

    //     // Меняем цвет сердца на обычный
    //     if (heartIcon) {
    //         heartIcon.src = "svgs/like.svg"; // Путь к обычному изображению сердца
    //     }

    //     alert('Product removed from favorites!');
    // }
}

document.addEventListener("DOMContentLoaded", () => {
    // Получаем список избранных товаров из localStorage
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

        // Получаем информацию о товаре, проверяя наличие каждого элемента
        const nameElement = productElement.querySelector('.name');
        const priceElement = productElement.querySelector('.price');
        const descrElement = productElement.querySelector('.descr');
        const colorElement = productElement.querySelector('.color');
        const scentElement = productElement.querySelector('.scent');

        // Проверяем, что все необходимые элементы существуют
        if (!nameElement || !priceElement || !descrElement || !colorElement || !scentElement) {
            console.error("One or more product details are missing");
            return;
        }

        const name = nameElement.textContent;
        const price = priceElement.textContent;
        const descr = descrElement.textContent;
        const color = colorElement.textContent;
        const scent = scentElement.textContent.trim();

        // Теперь проверяем наличие всех параметров товара, включая запах
        const isProductInFavorites = favorites.some(product =>
            product.name === name &&
            product.price === price &&
            product.scent === scent // Добавляем запах в проверку
        );

        // Если товар в избранном, меняем цвет сердца на красный
        if (isProductInFavorites) {
            heartIcon.src = "svgs/like-red.svg";  // Меняем на красное сердце
        }
    });
});

const burgerMenu = document.getElementById('burger-menu');
const menu = document.getElementById('menu');

// Переключение состояния бургер-меню и отображение/скрытие меню
burgerMenu.addEventListener('click', () => {
    menu.classList.toggle('active');
});



const customSelect = document.getElementById('customSelect');
const selectedOption = document.getElementById('selectedOption');
const options = customSelect.querySelector('.options');
const optionItems = options.querySelectorAll('p');

// Открытие и закрытие списка
customSelect.addEventListener('click', (e) => {
  // Чтобы предотвратить закрытие, если клик был внутри списка
  e.stopPropagation();
  customSelect.classList.toggle('open');
});

// Обработка выбора опции
optionItems.forEach(item => {
  item.addEventListener('click', () => {
    selectedOption.textContent = item.textContent;
    customSelect.classList.remove('open');
  });
});

// Закрытие списка при клике вне элемента
document.addEventListener('click', (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove('open');
  }
});
