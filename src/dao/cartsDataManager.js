import mongoose from 'mongoose';
import {cartModel} from '../models/cart.model.js';
import {Router} from 'express';
import { ObjectId } from 'mongodb';
import {config} from '../config/config.js'


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
      console.error("Identificador del carrito invalido");
      } else {
       
        const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId');
       
        if (cart) {
          return(cart);
        } else {
          console.error('Carrito no encontrado');
        }
      }
  } catch (error) {
    console.error('Error en el servidor', error);
  }
};
async obtenerCarritoSinPopulate (cid)
{
  
  try {
    
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      console.error("Identificador del carrito invalido");
      } else {
       
        let cart = await cartModel.findOne({ _id : cartId });
       
        if (cart) {
          return(cart);
        } else {
          console.error('Carrito no encontrado');
        }
      }
  } catch (error) {
    console.error('Error en el servidor', error);
  }
};
// Actualizar un carrito
async actualizarCarrito (newcart,cid) 
{
  try {
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      console.error("Identificador del carrito invalido");
      } else {

        let cart = await cartModel.findOne({ _id : cartId }).exec();

        if (!cart) {
          console.error('Carrito no encontrado');
          return;
        }
            cart = newcart;
            await cart.save();
      
        }
      
  } catch (error) {
    console.error (`Error en el servidor ${error}`)
  }
};

// Crear un nuevo carrito
async crearCarrito  (newcart)
{
    try {
     
      await newcart.save();
      
    }
     catch (error) {
      console.error(`Error en el servidor ${error}`);
    }
  }; 

}

export default cartsDataManager
