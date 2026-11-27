
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const app = express();

app.use(express.json());

// Conectar con MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(error => console.error('Error de conexión:', error));

// GET - Listar todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
});

// GET - Obtener un producto por id
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(producto);
    } catch (error) {
        res.status(400).json({ mensaje: 'ID inválido' });
    }
});

// POST - Crear nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;

        if (!nombre || !descripcion || precio === undefined || precio === '') {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio
            });

            res.status(201).json(nuevoProducto);

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el producto'
        });
    }
});

// PUT - Actualizar producto
app.put('/productos/:id', async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;

        if (!nombre || !descripcion || precio === undefined || precio === '') {
            return res.status(400).json({
                mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
            });
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, precio },
            { new: true, runValidators: true }
            );

        if (!productoActualizado) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json(productoActualizado);

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el producto'
        });
    }
});

// DELETE - Eliminar producto
app.delete('/productos/:id', async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(
            req.params.id
        );

        if (!productoEliminado) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Producto eliminado',
            producto: productoEliminado
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'ID inválido'
        });
    }
});

// Iniciar servidor después de conectar a MongoDB
mongoose.connection.once('open', () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
    });
});
