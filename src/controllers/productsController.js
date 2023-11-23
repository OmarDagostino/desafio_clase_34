import { ObjectId } from 'mongodb';
import { productServices } from '../services/productsServices.js';
import {Router} from 'express';
const router = Router ()
import bodyParser from 'body-parser';
router.use(bodyParser.urlencoded({ extended: true }));
import { body, validationResult } from 'express-validator';
import { generateProducts }  from '../util.js';
import { CustomError } from '../errorManagement/diccionarioDeErrores.js';

// GET para retornar varios productos o todos
async function getProducts (req, res) {
  let customStatusCode =500 ;   
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortOrder = req.query.sort; 
    const query = req.query.query || ''; 
    const filter = {}; 
    if (req.query.category) {
      filter.category = req.query.category; 
    }
    if (req.query.stock) {
      filter.stock = req.query.stock; 
    }
     
    const options = {
      page,
      limit,
      sort: sortOrder ? { price: sortOrder === 'desc' ? -1 : 1 } : null,
    };
    const combinedFilter = {
      ...filter
    };

    const products = await productServices.obtenerProductos(combinedFilter, options);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < products.totalPages ? page + 1 : null;

    const response = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
      nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
    };

    res.json(response);
  } catch (error) {
    if (customStatusCode===500) {
      let error = CustomError.createCustomError(16);
          customStatusCode=error.codigo;
    }
    res.status(customStatusCode).send(`${error.descripcion} `);
  }
};

// GET para retornar un producto por su ID
async function getProductById (req, res) {
 let customStatusCode = 500;
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    
    if (!validObjectId) { 
      let error = CustomError.createCustomError(4);
      customStatusCode=error.codigo;
      throw (error);
      } else {
        const product = await productServices.obtenerProducto(productId);
        if (product) {
          res.json(product);
        } else {
          let error = CustomError.createCustomError(5);
          customStatusCode=error.codigo;
          throw (error);
        }
      }
  } catch (error) {
    if (customStatusCode===500) {
      let error = CustomError.createCustomError(15);
          customStatusCode=error.codigo;
    }
    res.status(customStatusCode).send(`${error.descripcion} `);
  }
};


// GET paara retornar 100 productos imaginarios creados con faker-js
async function getMockingProducts (req,res) {
  let products = [];
for (let i=0;i<100;i++) {
  products[i] = generateProducts ()
}
res.status(200).json(products);
}


// POST para crear un nuevo producto
async function crearProducto(req, res) {
  let customStatusCode =500            ;   
  try {
    
    const newProduct = req.body;
   
    // Verificar si el producto ya existe por su código
    const existingProduct = await productServices.obtenerProductoPorCodigo(newProduct.code);
    if (existingProduct) {
      
      let error = CustomError.createCustomError(18);
      customStatusCode=error.codigo;
      throw (error);
    }

    // const product = new productModel({ ...newProduct });
   
    await productServices.crearProducto(newProduct);
    let error = CustomError.createCustomError(19);
      customStatusCode=error.codigo;
      throw (error);
  } catch (error) {
    if (customStatusCode===500) {
      let error = CustomError.createCustomError(20);
          customStatusCode=error.codigo;
    }
    res.status(customStatusCode).send(`${error.descripcion} `);
  }
}


// PUT para actualizar un producto por su ID
async function actualizarProducto (req, res) {
  
  let customStatusCode =500            ;   
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    // validar formato de las propiedades
    const validateUpdateProduct = [
        body('title').optional().isString(),
        body('description').optional().isString(),
        body('code').optional().isString(),
        body('price').optional().isNumeric(),
        body('stock').optional().isNumeric(),
        body('category').optional().isString(),
        body('status').optional().isBoolean(),
         (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            let error = CustomError.createCustomError(14);
            customStatusCode=error.codigo;
            throw (error,errors.array());
          }
          next();
        }
      ];
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      let error = CustomError.createCustomError(4);
      customStatusCode=error.codigo;
      throw (error);
      } else {


    const product = await productServices.obtenerProducto(productId);

    if (!product) {
      let error = CustomError.createCustomError(5);
      customStatusCode=error.codigo;
      throw (error);
    }

    // Actualizar el producto
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }

    await productServices.actualizarProducto(product,productId);

    let error = CustomError.createCustomError(21);
      customStatusCode=error.codigo;
      throw (error);
  }
  } catch (error) {
    if (customStatusCode===500) {
      let error = CustomError.createCustomError(22);
          customStatusCode=error.codigo;
    }
    res.status(customStatusCode).send(`${error.descripcion} `);
  }
};

// DELETE para eliminar un producto por su ID
async function borrarProducto(req, res) {
  let customStatusCode =500 ;
  let updatedProducts=[]   ;   
  try {
    
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      let error = CustomError.createCustomError(4);
      customStatusCode=error.codigo;
      throw (error);
      } else {

    const product = await productServices.obtenerProducto(productId);

    if (!product) {
      let error = CustomError.createCustomError(5);
      customStatusCode=error.codigo;
      throw (error);
    }


    await productServices.eliminarProducto(productId)
    const options = {
      page: 1,
      limit: 10000000000000
    }
    updatedProducts = await productServices.obtenerProductos({},options);
    let error = CustomError.createCustomError(23);
      customStatusCode=error.codigo;
      return res.status(customStatusCode).json({ message: 'Producto eliminado', products: updatedProducts })
  
  }
  } catch (error) {
    if (customStatusCode===500) {
      let error = CustomError.createCustomError(17);
          customStatusCode=error.codigo;
    }
    res.status(customStatusCode).send(`${error.descripcion} `);
  }
};

export default {getProducts, getProductById, crearProducto, actualizarProducto, borrarProducto, getMockingProducts };
