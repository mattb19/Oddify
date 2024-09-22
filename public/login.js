// const loginElement = document.getElementById("loginForm");
// const registerElement = document.getElementById("registerForm");
// const signUpElement = document.getElementById("signUp");
// const signInElement = document.getElementById("signIn");
// console.log(registerElement);
// function login() {
//     loginElement.style.animation = "in 5s forwards";
//     registerElement.style.animation = "out 5s forwards";
//     signUpElement.style.animation = "in 4s forwards";
//     signInElement.style.animation = "out 4s forwards";
// }
// function register() {
//     registerElement.style.animation = "in 5s forwards";
//     loginElement.style.animation = "out 5s forwards";
//     signInElement.style.animation = "in 4s forwards";
//     signUpElement.style.animation = "out 4s forwards";
// }
document.addEventListener("DOMContentLoaded", function () {
    const loginElement = document.getElementById("loginForm");
    const registerElement = document.getElementById("registerForm");
    const signUpElement = document.getElementById("signUp");
    const signInElement = document.getElementById("signIn");

    console.log(registerElement);
});

function login() {
    const loginElement = document.getElementById("loginForm");
    const registerElement = document.getElementById("registerForm");
    const signUpElement = document.getElementById("signUp");
    const signInElement = document.getElementById("signIn");

    loginElement.style.animation = "in 5s forwards";
    registerElement.style.animation = "out 5s forwards";
    signUpElement.style.animation = "in 4s forwards";
    signInElement.style.animation = "out 4s forwards";
}

function register() {
    const loginElement = document.getElementById("loginForm");
    const registerElement = document.getElementById("registerForm");
    const signUpElement = document.getElementById("signUp");
    const signInElement = document.getElementById("signIn");

    registerElement.style.animation = "in 5s forwards";
    loginElement.style.animation = "out 5s forwards";
    signInElement.style.animation = "in 4s forwards";
    signUpElement.style.animation = "out 4s forwards";
}