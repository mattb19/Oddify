const loginElement = document.getElementById("loginForm");
const registerElement = document.getElementById("registerForm");
const signUpElement = document.getElementById("signUp");
const signInElement = document.getElementById("signIn");
console.log(registerElement);
console.log("JS Has been reached")
function login() {
    loginElement.style.animation = "in 0.1s forwards";
    registerElement.style.animation = "out 0.1s forwards";
    signUpElement.style.animation = "in 0.1s forwards";
    signInElement.style.animation = "out 0.1s forwards";
}
function register() {
    registerElement.style.animation = "in 0.1s forwards";
    loginElement.style.animation = "out 0.1s forwards";
    signInElement.style.animation = "in 0.1s forwards";
    signUpElement.style.animation = "out 0.1s forwards";
}
