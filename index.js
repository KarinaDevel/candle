let users = [];

const singInWind = document.getElementById("singInContr");

function openSingIn(){
    singInWind.style.display = "block";
}
function addUser() {
    const nameInp = document.getElementById("nameInp");
    const emailInp = document.getElementById("email");
    const passwordInp = document.getElementById("password");

    const name = nameInp.value.trim()
    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    if (!name || !email || !password){
        alert("Fill the fields")
        return
    }
    switch (true) {
        case !name || !password || !email:
            alert('Вы не заполнили все поля!');
            return;

        case !(email.includes('@') && email.includes('.')):
            emailInp.style.backgroundColor = 'rgba(228, 72, 72, 0.422)';
            emailInp.style.border = '1px solid red';
            emailInp.setAttribute('placeholder', 'Write the email in the correct format');
            emailInp.value = '';
            return;

        default:
            users.push({ name, password, email });
            break;
    }

    nameInp.value = '';
    passwordInp.value = '';
    emailInp.value = '';  
}