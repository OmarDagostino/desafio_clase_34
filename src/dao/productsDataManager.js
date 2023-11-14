import mongoose from 'mongoose';
import {productModel} from './models/user.model.js';
import {Router} from 'express';
import { ObjectId } from 'mongodb';
import {config} from '../config/config.js'

import { loggerWithLevel, logger } from '../logger.js';
import {ErrorDictionary, levelError} from '../errorDictionary.js';
const errorDict = new ErrorDictionary();
let levelErr = new levelError ();
let level
let err 
let mesageError

const router = Router ()

// Conectar a la base de datos MongoDB Atlas
mongoose.connect(config.MONGO_URL);


// clases para el manejo de productos

export class productsDataManager { 
 


// obtener una lista de productos con filtros y paginaciones

async obtenerProductos (combinedFilter, options)
{
  try {
    const products = await productModel.paginate(combinedFilter, options);

    return (products);
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    }
};

// obtener un producto por su ID
async obtenerProducto (pid) 
{
  try {
    const productId = pid ;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      err=452;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      } else {
        const product = await productModel.findOne({ _id: productId}).exec();
        if (product) {
          return (product);
        } else {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
        }
      }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
  }
};

// obtener un producto por su codigo

async obtenerProductoPorCodigo (codigo) 
{
  try {
  const existingProduct = await productModel.findOne({ code: codigo }).exec();
  return existingProduct
 }
 catch (error) {
  err=500;
  mesageError=errorDict.getErrorMessage(err);
  level = levelErr.getLevelError(err)
  loggerWithLevel (level,mesageError)
  }
};

// Crear un nuevo producto
async crearProducto (newProduct) 
{
    try {
      
      const product = new productModel({ ...newProduct});
      await product.save();
  
      
    } catch (error) {
      err=500;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
    }
  };
  

// actualizar un productos
async actualizarProducto (producto,pid) 
{
  try {
    const productId = pid;
    const updatedProduct = producto;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      err=452;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      } else {


    let product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      return;
    }


    product = updatedProduct
    await product.save();
    
  }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError);
  }
};

// Eliminar un producto por su ID
async eliminarProducto (pid) 
{
  try {
    const productId = pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
        err=452;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
      } else {

    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
        err=404;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
        return;
    }

    await product.deleteOne({ _id : productId })
    console.log(`Producto con ID ${productId} eliminado`)
  }
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
  }
}
}

export default productsDataManager
