const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const forgotBtn = document.querySelector('.forgot-btn');
const backToLogin = document.querySelector('.back-to-login');
const forgotForm = document.querySelector('.forgot-password form');
const backButtons = document.querySelectorAll('.back-to-login');
const togglePasswordIcons = document.querySelectorAll('.toggle-password');
const loginForm = document.querySelector('.form-box.login form');

registerLink.addEventListener('click', () => {
    wrapper.classList.remove('show-forgot');
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('show-forgot');
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('show-forgot');
});

forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = forgotForm.querySelector('.btn');
    
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        
        wrapper.classList.remove('show-forgot');
        wrapper.classList.add('show-success');
    }, 2000);
});

backButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('show-success', 'show-forgot', 'active');
        document.querySelector('.form-box.login').style.display = 'flex';
    });
});

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const passwordInput = this.parentElement.querySelector('input');
        
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        if (isPassword) {
            this.classList.remove('bx-lock');
            this.classList.add('bx-lock-open-alt');
            this.style.color = 'var(--secondary-color)';
        } else {
            this.classList.remove('bx-lock-open-alt');
            this.classList.add('bx-lock');
            this.style.color = 'var(--tertiary-color)';
        }
    });
});

loginForm.addEventListener('submit', (e) => {
    if (!loginForm.checkValidity()) {
        e.preventDefault(); 
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    console.log("Formulário válido, enviando...");
});