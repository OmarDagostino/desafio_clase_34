import {Router} from 'express';
import { authAdmin } from '../util.js';
import productsController from '../controllers/productsController.js'
import { body, validationResult } from 'express-validator';

const router = Router ()

import bodyParser from 'body-parser';

router.use(bodyParser.urlencoded({ extended: true }));

// GET para retornar varios productos o todos
router.get('/products', productsController.getProducts);

// GET para retornar un producto por su ID
router.get('/products/:pid', productsController.getProductById);

// GET para retornar 100 productos imaginarios creados con Fake-js
router.get ('/mockingproducts', productsController.getMockingProducts)

// POST para crear un nuevo producto
router.post(
    '/products',
    authAdmin,
    [
      body('title').notEmpty().isString(),
      body('description').notEmpty().isString(),
      body('code').notEmpty().isString(),
      body('price').notEmpty().isNumeric(),
      body('stock').notEmpty().isNumeric(),
      body('category').notEmpty().isString(),
      body('status').optional().isBoolean(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      productsController.crearProducto (req,res) 
         }
  );
  
// PUT para actualizar un producto por su ID
router.put('/products/:pid',authAdmin, async (req,res)=> { 

  await productsController.actualizarProducto (req,res)
});

// DELETE para eliminar un producto por su ID
router.delete('/products/:pid',authAdmin, productsController.borrarProducto);

export default router;
