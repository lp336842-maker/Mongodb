const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/productos')

.then(() => console.log('Conexión exitosa a la base de datos'))
.catch((error) => console.error('Error de conexión a la base de datos:', error));