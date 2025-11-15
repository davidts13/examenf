// ========================================
// SERIE I: Autenticación (Login)
// API: https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const alertMessage = document.getElementById('alertMessage');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const toggleIcon = document.getElementById('toggleIcon');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const loginBtn = document.getElementById('loginBtn');

    // Toggle Password Visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            if (type === 'text') {
                toggleIcon.classList.remove('bi-eye');
                toggleIcon.classList.add('bi-eye-slash');
            } else {
                toggleIcon.classList.remove('bi-eye-slash');
                toggleIcon.classList.add('bi-eye');
            }
        });
    }

    // Focus Animation for Inputs
    const inputs = [usernameInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Form Submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!username || !password) {
            showAlert('Por favor complete todos los campos', 'danger');
            return;
        }

        // Validación del formato de usuario
        if (username.includes('@')) {
            showAlert('Solo ingrese la parte antes del @miumg.edu.gt', 'warning');
            return;
        }

        // Deshabilitar el botón y mostrar spinner
        setLoadingState(true);
        showAlert('Autenticando...', 'info');

        try {
            // Petición POST a la API de autenticación
            const response = await fetch('https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: username,
                    Password: password
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('La respuesta del servidor no es válida');
            }

            if (response.ok) {
                // Autenticación exitosa
                // Buscar el token en la respuesta (puede venir en diferentes formatos)
                const token = data.token || data.Token || data.accessToken || data.AccessToken ||
                              data.bearer || data.Bearer || data.jwt || data.JWT;

                if (token) {
                    // Guardar el token de forma segura en sessionStorage
                    sessionStorage.setItem('bearerToken', token);
                    sessionStorage.setItem('username', username);

                    console.log('✅ Token guardado exitosamente');
                    console.log('Token (preview):', token.substring(0, 30) + '...');

                    showAlert('¡Autenticación exitosa! Redirigiendo...', 'success');

                    // Animación de éxito
                    loginBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        loginBtn.style.transform = 'scale(1)';
                    }, 200);

                    // Redirigir a la página de chat después de 1.5 segundos
                    setTimeout(() => {
                        window.location.href = 'chat.html';
                    }, 1500);

                } else {
                    setLoadingState(false);
                    showAlert('Autenticación exitosa pero no se recibió token. Verifique la respuesta de la API.', 'warning');
                    console.warn('Respuesta completa:', data);
                }
            } else {
                // Error de autenticación
                setLoadingState(false);
                const errorMsg = data.message || data.error || data.Message || data.Error || 'Credenciales inválidas';
                showAlert('❌ Error de autenticación: ' + errorMsg, 'danger');
                console.error('Error de autenticación:', data);

                // Animación de error
                loginBtn.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginBtn.style.animation = '';
                }, 500);
            }

        } catch (error) {
            setLoadingState(false);
            console.error('Error de red:', error);
            showAlert('🔌 Error de conexión. Verifique su conexión a internet y que la API esté disponible.', 'danger');

            // Animación de error
            loginBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginBtn.style.animation = '';
            }, 500);
        }
    });

    // Función para mostrar alertas con animación
    function showAlert(message, type) {
        alertMessage.className = `alert-custom ${type}`;
        alertMessage.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${getIconForType(type)} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        alertMessage.style.display = 'block';

        // Auto-ocultar alertas de éxito e info
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                alertMessage.style.opacity = '0';
                setTimeout(() => {
                    alertMessage.style.display = 'none';
                    alertMessage.style.opacity = '1';
                }, 300);
            }, 4000);
        }
    }

    // Obtener icono según el tipo de alerta
    function getIconForType(type) {
        const icons = {
            'success': 'bi-check-circle-fill',
            'danger': 'bi-x-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        return icons[type] || 'bi-info-circle-fill';
    }

    // Función para manejar el estado de carga del botón
    function setLoadingState(loading) {
        if (loading) {
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
            loginBtn.disabled = true;
            usernameInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
            loginBtn.disabled = false;
            usernameInput.disabled = false;
            passwordInput.disabled = false;
        }
    }
});

// Animación de shake para errores
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
