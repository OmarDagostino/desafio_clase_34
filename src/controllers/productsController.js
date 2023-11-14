import { ObjectId } from 'mongodb';
import { productServices } from '../services/productsServices.js';
import {Router} from 'express';
const router = Router ()
import bodyParser from 'body-parser';
router.use(bodyParser.urlencoded({ extended: true }));
import { body, validationResult } from 'express-validator';
import { generateProducts }  from '../util.js';
import { loggerWithLevel, logger } from '../logger.js';
import {ErrorDictionary, levelError} from '../errorDictionary.js';
const errorDict = new ErrorDictionary();
let levelErr = new levelError ();
let level
let err 
let mesageError


// GET para retornar varios productos o todos
async function getProducts (req, res) {
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
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

// GET para retornar un producto por su ID
async function getProductById (req, res) {
 
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {
        const product = await productServices.obtenerProducto(productId);
        if (product) {
          res.json(product);
        } else {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
        }
      }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

// GET paara retornar 100 productos imaginarios creados con faker-js
async function getMockingProducts (req,res) {
  let products = [];
for (let i=0;i<100;i++) {
  products[i] = generateProducts ()
}
err=200;
mesageError=errorDict.getErrorMessage(err);
level = levelErr.getLevelError(err)
loggerWithLevel (level,mesageError)
res.status(err).json(products);
}

// POST para crear un nuevo producto
async function crearProducto(req, res) {
  try {
    
    const newProduct = req.body;
  
    // Verificar si el producto ya existe por su código
    const existingProduct = await productServices.obtenerProductoPorCodigo(newProduct.code);
    if (existingProduct) {
      err=454;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return;
    }

    // const product = new productModel({ ...newProduct });
   
    await productServices.crearProducto(newProduct);
    err=201;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).json(newProduct);
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
}


// PUT para actualizar un producto por su ID
async function actualizarProducto (req, res) {
  
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
            res.setHeader('Content-Type','application/json');
            err=453;
            return res.status(453).json({ errors: errors.array() });
          }
          next();
        }
      ];
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      err=452;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {


    const product = await productServices.obtenerProducto(productId);

    if (!product) {
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return;
    }

    // Actualizar el producto
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }

    await productServices.actualizarProducto(product,productId);
    err=201;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).json(product);
  }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

// DELETE para eliminar un producto por su ID
async function borrarProducto(req, res) {
  try {
    
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      err=452;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {

    const product = await productServices.obtenerProducto(productId);

    if (!product) {
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return;
    }


    await productServices.eliminarProducto(productId)
    const options = {
      page: 1,
      limit: 10000000000000
    }
    const updatedProducts = await productServices.obtenerProductos({},options);
    err=200;
    res.status(err).json({ message: 'Producto eliminado', products: updatedProducts })
  }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

export default {getProducts, getProductById, crearProducto, actualizarProducto, borrarProducto, getMockingProducts };
