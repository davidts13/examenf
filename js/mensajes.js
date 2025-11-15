// ========================================
// SERIE II: Envío de Mensajes (Formulario Protegido)
// API: https://backcvbgtmdesa.azurewebsites.net/api/Mensajes
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const token = sessionStorage.getItem('bearerToken');
    const username = sessionStorage.getItem('username');

    if (!token || !username) {
        showNotification('No ha iniciado sesión. Redirigiendo al login...', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    console.log('✅ Usuario autenticado:', username);

    // Elementos del DOM
    const userDisplay = document.getElementById('userDisplay');
    const loginEmisorInput = document.getElementById('loginEmisor');
    const contenidoTextarea = document.getElementById('contenido');
    const charCount = document.getElementById('charCount');
    const messageForm = document.getElementById('messageForm');
    const alertMessage = document.getElementById('alertMessage');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const sendBtn = document.getElementById('sendBtn');

    // Mostrar usuario en la página
    if (userDisplay) {
        userDisplay.textContent = username;
    }

    // Establecer el login emisor
    if (loginEmisorInput) {
        loginEmisorInput.value = username;
    }

    // Contador de caracteres
    if (contenidoTextarea && charCount) {
        contenidoTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;

            // Cambiar color según el límite
            if (count > 900) {
                charCount.style.color = '#dc3545';
                charCount.style.fontWeight = 'bold';
            } else if (count > 750) {
                charCount.style.color = '#ffa726';
                charCount.style.fontWeight = 'bold';
            } else {
                charCount.style.color = '#6c757d';
                charCount.style.fontWeight = 'normal';
            }
        });
    }

    // Manejar el envío del formulario
    messageForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const codSala = parseInt(document.getElementById('codSala').value);
        const loginEmisor = loginEmisorInput.value.trim();
        const contenido = contenidoTextarea.value.trim();

        // Validaciones
        if (!contenido) {
            showAlert('📝 Por favor escriba un mensaje antes de enviar', 'warning');
            contenidoTextarea.focus();
            return;
        }

        if (contenido.length < 3) {
            showAlert('El mensaje debe tener al menos 3 caracteres', 'warning');
            return;
        }

        // Mostrar estado de carga
        setLoadingState(true);
        showAlert('📤 Enviando mensaje...', 'info');

        try {
            // Construir el JSON según la especificación de la Serie II
            const requestBody = {
                Cod_Sala: codSala,
                Login_Emisor: loginEmisor,
                Contenido: contenido
            };

            console.log('📨 Enviando mensaje:', requestBody);
            console.log('🔑 Token (preview):', token.substring(0, 30) + '...');

            // Petición POST a la API de mensajes con el Token Bearer
            const response = await fetch('https://backcvbgtmdesa.azurewebsites.net/api/Mensajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // CRÍTICO: Token Bearer
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            setLoadingState(false);

            if (response.ok) {
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    data = { message: 'Mensaje enviado' };
                }

                console.log('✅ Respuesta exitosa:', data);

                showAlert('✅ ¡Mensaje enviado exitosamente!', 'success');

                // Limpiar el formulario con animación
                contenidoTextarea.value = '';
                charCount.textContent = '0';

                // Animación de éxito
                sendBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    sendBtn.style.transform = 'scale(1)';
                }, 200);

                // Preguntar si desea ver los mensajes
                setTimeout(() => {
                    if (confirm('✅ Mensaje enviado con éxito.\n\n¿Desea ver todos los mensajes del chat?')) {
                        window.location.href = 'view.html';
                    }
                }, 1500);

            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = await response.text();
                }

                console.error('❌ Error en la respuesta:', response.status, errorData);

                if (response.status === 401 || response.status === 403) {
                    showAlert('🔒 Error de autenticación. Su sesión ha expirado. Redirigiendo al login...', 'danger');
                    setTimeout(() => {
                        logout();
                    }, 2500);
                } else {
                    const errorMsg = errorData.message || errorData.error || errorData || 'Error desconocido';
                    showAlert(`❌ Error al enviar mensaje: ${response.status} - ${errorMsg}`, 'danger');
                }

                // Animación de error
                sendBtn.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    sendBtn.style.animation = '';
                }, 500);
            }

        } catch (error) {
            setLoadingState(false);
            console.error('🔌 Error de red:', error);
            showAlert('🔌 Error de conexión. Verifique su conexión a internet y que la API esté disponible.', 'danger');

            // Animación de error
            sendBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                sendBtn.style.animation = '';
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
            }, 5000);
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
            sendBtn.disabled = true;
            contenidoTextarea.disabled = true;
        } else {
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
            sendBtn.disabled = false;
            contenidoTextarea.disabled = false;
        }
    }

    // Notificación del sistema
    function showNotification(message, type) {
        // Aquí podrías implementar notificaciones toast si lo deseas
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
});

// Función para cerrar sesión (global)
function logout() {
    sessionStorage.removeItem('bearerToken');
    sessionStorage.removeItem('username');
    console.log('🚪 Sesión cerrada');
    window.location.href = 'index.html';
}

// Animación de shake para errores
if (!document.getElementById('shake-animation-style')) {
    const style = document.createElement('style');
    style.id = 'shake-animation-style';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}
