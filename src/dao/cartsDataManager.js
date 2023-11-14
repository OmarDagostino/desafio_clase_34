import mongoose from 'mongoose';
import {cartModel} from './models/user.model.js';
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
await mongoose.connect(config.MONGO_URL);

// clases para manejo de datos de carritos

export class cartsDataManager { 


// Obtener un carrito por su ID
async obtenerCarrito (cid)
{
  
  try {
    
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      } else {
        const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId');
          if (cart) {
          return(cart);
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
async obtenerCarritoSinPopulate (cid)
{
  
  try {
    
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      console.error(mesageError);
      } else {
       
        let cart = await cartModel.findOne({ _id : cartId });
       
        if (cart) {
          return(cart);
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
    console.error(mesageError, error);
  }
};
// Actualizar un carrito
async actualizarCarrito (newcart,cid) 
{
  try {
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
          err=451;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
      } else {

        let cart = await cartModel.findOne({ _id : cartId }).exec();

        if (!cart) {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          return;
        }
            cart = newcart;
            await cart.save();
      
        }
      
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err);
    loggerWithLevel (level,mesageError);
  }
};

// Crear un nuevo carrito
async crearCarrito  (newcart)
{
    try {
     
      await newcart.save();
      
    }
     catch (error) {
      err=500;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
    }
  }; 

}

export default cartsDataManager
