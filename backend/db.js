// db.js - Configuración de conexión a SQL Server
import sql from 'mssql';

// SERIE III: Configuración de conexión a SQL Server
const config = {
    server: 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
    user: 'usr_DesaWebDevUMG',
    password: '!ngGuast@360',
    database: 'db_DesaWebDevUMG',
    options: {
        encrypt: true, // Para Azure SQL
        trustServerCertificate: true, // Cambiar a false en producción
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

export async function connectDB() {
    try {
        if (pool) {
            return pool;
        }

        console.log('Conectando a SQL Server...');
        console.log(`Server: ${config.server}`);
        console.log(`Database: ${config.database}`);

        pool = await sql.connect(config);
        console.log('Conexión a SQL Server establecida exitosamente');

        return pool;
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        throw error;
    }
}

export async function getMessages(sortOrder = 'DESC') {
    try {
        const pool = await connectDB();

        // Validar sortOrder para prevenir SQL injection
        const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Primero, obtener la estructura de la tabla para descubrir los nombres de columnas
        try {
            const schemaQuery = `
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'Chat_Mensaje'
                ORDER BY ORDINAL_POSITION
            `;
            const schemaResult = await pool.request().query(schemaQuery);
            console.log('📋 Columnas disponibles en Chat_Mensaje:', schemaResult.recordset.map(r => r.COLUMN_NAME).join(', '));
        } catch (schemaError) {
            console.log('⚠️ No se pudo obtener el esquema de la tabla');
        }

        // Query simple con SELECT * - dejamos que la base de datos nos diga qué columnas tiene
        const query = `
            SELECT TOP 1000 *
            FROM [dbo].[Chat_Mensaje]
        `;

        console.log(`Ejecutando consulta...`);
        const result = await pool.request().query(query);

        console.log(`✅ Se obtuvieron ${result.recordset.length} mensajes`);

        // Log de la estructura real de los datos
        if (result.recordset.length > 0) {
            console.log('📊 Columnas encontradas:', Object.keys(result.recordset[0]).join(', '));
            console.log('📄 Primer mensaje (muestra):', result.recordset[0]);
        }

        // Ordenar los resultados en JavaScript según el parámetro
        let messages = result.recordset;

        // Intentar encontrar la columna de fecha (puede tener diferentes nombres)
        const firstRow = messages[0];
        let dateColumn = null;

        if (firstRow) {
            // Buscar la columna de fecha entre los nombres posibles
            const possibleDateColumns = ['Fec_Mensaje', 'FecMensaje', 'Fecha', 'FechaMensaje', 'fecha_mensaje', 'fecha'];
            for (const col of possibleDateColumns) {
                if (col in firstRow) {
                    dateColumn = col;
                    console.log(`📅 Columna de fecha detectada: ${dateColumn}`);
                    break;
                }
            }

            // Si no encontramos una columna específica, buscar cualquier columna con 'fecha' o 'fec' en el nombre
            if (!dateColumn) {
                const keys = Object.keys(firstRow);
                dateColumn = keys.find(k => k.toLowerCase().includes('fec') || k.toLowerCase().includes('fecha'));
                if (dateColumn) {
                    console.log(`📅 Columna de fecha detectada (búsqueda flexible): ${dateColumn}`);
                }
            }
        }

        // Ordenar por la columna de fecha si la encontramos, sino por ID
        if (dateColumn) {
            messages.sort((a, b) => {
                const dateA = new Date(a[dateColumn]);
                const dateB = new Date(b[dateColumn]);
                return validSortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
            });
            console.log(`✅ Mensajes ordenados por ${dateColumn} (${validSortOrder})`);
        } else {
            // Ordenar por ID si no hay columna de fecha
            const idColumn = Object.keys(firstRow || {}).find(k => k.toLowerCase().includes('id'));
            if (idColumn) {
                messages.sort((a, b) => {
                    return validSortOrder === 'ASC' ? a[idColumn] - b[idColumn] : b[idColumn] - a[idColumn];
                });
                console.log(`✅ Mensajes ordenados por ${idColumn} (${validSortOrder})`);
            }
        }

        return messages;
    } catch (error) {
        console.error('❌ Error al obtener mensajes:', error);
        throw error;
    }
}

export async function closeDB() {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Conexión a SQL Server cerrada');
        }
    } catch (error) {
        console.error('Error al cerrar conexión:', error);
    }
}

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});

export default { connectDB, getMessages, closeDB };
