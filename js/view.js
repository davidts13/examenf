// ========================================
// SERIE III: Visualización de Mensajes (Vista Cronológica)
// Backend: http://localhost:3000/api/mensajes
// SQL Server: svr-sql-ctezo.southcentralus.cloudapp.azure.com
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando carga de mensajes desde SQL Server...');
    loadMessages();

    // Auto-refresh cada 30 segundos (opcional)
    // setInterval(loadMessages, 30000);
});

async function loadMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const alertMessage = document.getElementById('alertMessage');
    const messageCount = document.getElementById('messageCount');
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');

    // Orden por defecto (más recientes primero)
    const sortOrder = 'desc';

    // Mostrar spinner de carga
    loadingSpinner.style.display = 'block';
    messagesContainer.innerHTML = '';
    alertMessage.style.display = 'none';

    // Actualizar estado
    updateStatus('loading', 'Cargando...');

    try {
        console.log(`📡 Realizando petición GET a: http://localhost:3000/api/mensajes?sort=${sortOrder}`);

        // Realizar petición GET al backend local que consulta SQL Server
        const response = await fetch(`http://localhost:3000/api/mensajes?sort=${sortOrder}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        loadingSpinner.style.display = 'none';

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const messages = await response.json();

        console.log(`✅ Mensajes recibidos:`, messages.length);

        if (!Array.isArray(messages)) {
            throw new Error('La respuesta no es un array válido');
        }

        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-chat-left-dots" style="font-size: 5rem; color: #ccc;"></i>
                    </div>
                    <h4 class="text-muted">No hay mensajes disponibles</h4>
                    <p class="text-muted">Sé el primero en enviar un mensaje al chat</p>
                    <a href="chat.html" class="btn btn-primary mt-3">
                        <i class="bi bi-plus-circle me-2"></i>
                        Enviar Mensaje
                    </a>
                </div>
            `;
            messageCount.textContent = '0';
            updateStatus('success', 'Conectado');
            return;
        }

        // Actualizar contador
        messageCount.textContent = messages.length;
        updateStatus('success', 'Conectado');

        // Detectar el nombre de la columna de fecha automáticamente
        const firstMsg = messages[0];

        // MOSTRAR TODAS LAS COLUMNAS DEL PRIMER MENSAJE
        console.log('🔍 PRIMER MENSAJE COMPLETO:', firstMsg);
        console.log('🔍 TODAS LAS COLUMNAS:', Object.keys(firstMsg));

        const possibleDateColumns = ['Fec_Mensaje', 'FecMensaje', 'Fecha', 'FechaMensaje', 'fecha_mensaje', 'fecha', 'Fecha_Envio'];
        let dateColumn = possibleDateColumns.find(col => col in firstMsg);

        // Si no encontramos ninguna, buscar cualquier columna que contenga 'fec' o 'fecha'
        if (!dateColumn) {
            dateColumn = Object.keys(firstMsg).find(k => k.toLowerCase().includes('fec') || k.toLowerCase().includes('fecha'));
        }

        console.log('📅 Usando columna de fecha:', dateColumn);

        // Detectar columnas - buscar EXACTAMENTE primero, luego con includes
        const allColumns = Object.keys(firstMsg);

        // ID - buscar columna que tenga 'id' y 'mensaje' juntos
        const idColumn = allColumns.find(k => k.toLowerCase().includes('id') && k.toLowerCase().includes('mensaje')) ||
                         allColumns.find(k => k.toLowerCase() === 'id') ||
                         'ID_Mensaje';

        // Sala
        const salaColumn = allColumns.find(k => k.toLowerCase().includes('sala')) || 'Cod_Sala';

        // Usuario - buscar login o emisor
        const usuarioColumn = allColumns.find(k => k.toLowerCase().includes('login') || k.toLowerCase().includes('emisor')) || 'Login_Emisor';

        // Contenido - buscar EXACTAMENTE "Contenido" primero antes de buscar con includes
        const contenidoColumn = allColumns.find(k => k === 'Contenido') ||
                               allColumns.find(k => k.toLowerCase() === 'contenido') ||
                               allColumns.find(k => k.toLowerCase().includes('contenido') && !k.toLowerCase().includes('id')) ||
                               allColumns.find(k => k.toLowerCase().includes('texto')) ||
                               'Contenido';

        console.log('📊 Columnas detectadas:');
        console.log('  - ID:', idColumn, '=', firstMsg[idColumn]);
        console.log('  - Sala:', salaColumn, '=', firstMsg[salaColumn]);
        console.log('  - Usuario:', usuarioColumn, '=', firstMsg[usuarioColumn]);
        console.log('  - Contenido:', contenidoColumn, '=', firstMsg[contenidoColumn]);
        console.log('  - Fecha:', dateColumn, '=', firstMsg[dateColumn]);

        // Renderizar mensajes con animación
        messagesContainer.innerHTML = messages.map((msg, index) => {
            // Obtener la fecha usando la columna detectada
            const fechaValue = dateColumn ? msg[dateColumn] : new Date();
            const fecha = new Date(fechaValue);
            const fechaFormateada = fecha.toLocaleString('es-GT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Formato relativo de tiempo
            const tiempoRelativo = getRelativeTime(fecha);

            // Colores alternados para mejor visualización
            const colorClass = index % 2 === 0 ? 'bg-white' : 'bg-light';

            return `
                <div class="message-card card mb-2 ${colorClass}" style="animation-delay: ${index * 0.05}s">
                    <div class="card-body p-3">
                        <div class="d-flex align-items-start gap-3">
                            <div class="avatar-circle flex-shrink-0">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-1 fw-bold text-primary">
                                    ${escapeHtml(msg[usuarioColumn] || 'Usuario')}
                                </h6>
                                <p class="mb-0 text-dark">
                                    ${escapeHtml(msg[contenidoColumn] || 'Sin contenido')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        showAlert(`✅ Se cargaron ${messages.length} mensajes exitosamente desde SQL Server`, 'success');

    } catch (error) {
        console.error('❌ Error al cargar mensajes:', error);
        loadingSpinner.style.display = 'none';
        updateStatus('error', 'Error');

        messagesContainer.innerHTML = `
            <div class="alert alert-danger">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-exclamation-triangle-fill fs-1 me-3"></i>
                    <div>
                        <h5 class="alert-heading mb-1">Error de Conexión al Backend</h5>
                        <p class="mb-0">No se pudo conectar al servidor backend local</p>
                    </div>
                </div>
                <hr>
                <div class="mb-3">
                    <strong>Detalles del error:</strong>
                    <code class="d-block mt-2 p-2 bg-dark text-white rounded">
                        ${error.message}
                    </code>
                </div>
                <div class="mb-3">
                    <strong>🔧 Solución:</strong>
                    <ol class="mt-2 mb-0">
                        <li>Asegúrate de que Node.js esté instalado</li>
                        <li>Abre una terminal en la carpeta del proyecto</li>
                        <li>Ejecuta los siguientes comandos:</li>
                    </ol>
                    <code class="d-block mt-2 p-3 bg-dark text-white rounded">
                        cd backend<br>
                        npm install<br>
                        npm start
                    </code>
                </div>
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    El servidor backend debe estar ejecutándose en <strong>http://localhost:3000</strong>
                </div>
            </div>
        `;

        showAlert(`❌ Error: ${error.message}`, 'danger');
    }
}

// Función para obtener tiempo relativo
function getRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // diferencia en segundos

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
    return date.toLocaleDateString('es-GT');
}

// Función para mostrar alertas con animación
function showAlert(message, type) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.className = `alert-custom ${type}`;
    alertMessage.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getIconForType(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    alertMessage.style.display = 'block';

    if (type === 'success') {
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

// Actualizar estado de conexión
function updateStatus(status, text) {
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');

    const statusConfig = {
        'loading': { class: 'bg-warning', icon: 'bi-hourglass-split' },
        'success': { class: 'bg-success', icon: 'bi-wifi' },
        'error': { class: 'bg-danger', icon: 'bi-wifi-off' }
    };

    const config = statusConfig[status] || statusConfig.success;

    statusBadge.className = `badge ${config.class} px-3 py-2`;
    statusText.innerHTML = `<i class="${config.icon} me-1"></i>${text}`;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para cerrar sesión (global)
function logout() {
    sessionStorage.removeItem('bearerToken');
    sessionStorage.removeItem('username');
    console.log('🚪 Sesión cerrada');
    window.location.href = 'index.html';
}

// Añadir estilos para el avatar
const style = document.createElement('style');
style.textContent = `
    .avatar-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }

    .message-content {
        background: rgba(102, 126, 234, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }

    .bg-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
`;
document.head.appendChild(style);
