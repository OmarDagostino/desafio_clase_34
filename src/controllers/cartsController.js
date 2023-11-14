import { ObjectId } from 'mongodb';
import { productServices } from '../services/productsServices.js';
import {cartModel, ticketsModel} from '../dao/models/user.model.js';
import {cartsServices} from '../services/cartsServices.js'
import { ticketsServices } from '../services/ticketsServices.js';
import { usersServices } from '../services/usersServices.js';
import nodemailer from 'nodemailer';
import {config} from '../config/config.js';
import {Router} from 'express';
const router = Router ()
import bodyParser from 'body-parser';
router.use(bodyParser.urlencoded({ extended: true }));
import { loggerWithLevel, logger } from '../logger.js';
import {ErrorDictionary, levelError} from '../errorDictionary.js';
const errorDict = new ErrorDictionary();
let levelErr = new levelError ();
let level
let err 
let mesageError

const transport = nodemailer.createTransport({
  service:'gmail',
  port:config.PORT,
  auth:{
    user:config.GMAIL_USER,
    pass:config.GMAIL_PASS
  }
})
// GET para retornar un carrito por su ID
async function getCarrito (req, res) {
  try {
    const cartId = req.params.cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {
        const cart = await cartsServices.obtenerCarrito(cid);
        if (cart) {
          res.json(cart);
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

// POST para agregar un producto a un carrito existente
async function agregarProducto(req, res) {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {
        const cart = await cartsServices.obtenerCarritoSinPopulate(cartId);
        if (!cart) {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          return;
        }

        // Añadir el producto al carrito

        const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
        if (!validObjectId) { 
          err=452;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          return;
          } else {
            const existingProduct = cart.products.find((p) => p.productId == productId);
            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
                const product = await productServices.obtenerProducto(productId);
                if (product) {
                  cart.products.push({ productId, quantity })
                } else {
                  err=404;
                  mesageError=errorDict.getErrorMessage(err);
                  level = levelErr.getLevelError(err)
                  loggerWithLevel (level,mesageError)
                  res.status(err).send(mesageError);
                  return;
                };
              }
            await cartsServices.actualizarCarrito(cart,cartId)
            err=201;
            mesageError= errorDict.getErrorMessage(err);
            level = levelErr.getLevelError(err)
            loggerWithLevel (level,mesageError)
            res.status(err).json(cart);
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

// POST para crear un nuevo carrito
async function crearCarrito(req, res) {
    try {
      const productId = req.params.pid;
      const quantity = 1;
  
      // Verificar si el producto existe en la base de datos de productos
      const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
      if (!validObjectId) { 
        err=452;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
        res.status(err).send(mesageError);
        } else {
      const product = await obtenerProducto(productId);
  
      if (!product) {
        err=404;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
        res.status(err).send(mesageError);
        return;
      }
  
      const newCart = new cartModel({
        products: [{ productId, quantity }]
      });
     
      await cartsServices.crearCarrito(newCart);
      err=201;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).json(newCart);
    }
    } catch (error) {
      err=500
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError,error);
    }
  };

// POST para hacer el proceso de compra
async function procesoDeCompra (req,res) {
  try{ 
    const cartId = req.params.cid;
    const cart = await cartsServices.obtenerCarrito(cartId);
    
    if (!cart) {
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return;
    }
   let updatedCart = cart 
    // comprobacion de stock suficiente y actualizacion 

    const productsToTicket = []
    const productsToWait = []

    for (let i=0; i < cart.products.length; i++)  {
      const ProductId = cart.products[i].productId._id 
      const Cantidad = cart.products[i].quantity
      const Precio = cart.products[i].productId.price
     
      let newStock=0
     
      if (cart.products[i].productId.stock >= cart.products[i].quantity) {   
          let itemDelTicket = {productId: ProductId, quantity: Cantidad, price: Precio}  
          productsToTicket.push(itemDelTicket)    
          newStock= cart.products[i].productId.stock - Cantidad     
      }
      else { 
        const Cantidad = cart.products[i].productId.stock 
        const CantidadRemanente = cart.products[i].quantity-cart.products[i].productId.stock
        
        if (Cantidad) { 
          const itemDelTicket = {productId: ProductId, quantity: Cantidad, price: Precio}  
          productsToTicket.push(itemDelTicket)}
          const itemRemanente = {ProductId: ProductId, Cantidad: CantidadRemanente}
        productsToWait.push(itemRemanente)    
      }     
      const producto = await productServices.obtenerProducto(ProductId)
      producto.stock = newStock
      await productServices.actualizarProducto(producto, ProductId)
    }
    // calculo del total del ticket 

    const totalTicket = productsToTicket.reduce((total, item) => {
      const subtotal = item.price * item.quantity;
      return total + subtotal;
    }, 0);


    // calculo de descuentos e impuestos 

    const discounts = 0;
    const taxes = 0;
    const amount = totalTicket - discounts + taxes;
    // generacion del ticket de compra
      let codigoMayor = await ticketsServices.obtenerCodigoMayor()
      codigoMayor++
      const codigo = codigoMayor.toString ()
      const user= await usersServices.obtenerUsuarioPorCartid (cartId)
      const userId = user._id
      const newtickect = {
        products: productsToTicket,
        code:codigo,
        cartId:cartId,
        userId: userId,
        taxes: taxes ,
        discounts: discounts,
        amount: amount,
      }

    ticketsServices.crearTicket(newtickect)
    
    // envio de correo al usuario con el ticket de compra
  
    const useremail = user.email
    const sendermail = config.GMAIL_USER
        
    let subject = `Ticket de compra ${codigo}`
   
    let emailContent = '<table border="1"><tr><th>Identificador del Producto</th><th>Cantidad</th><th>Precio</th></tr>';
    productsToTicket.forEach(item => {
        emailContent += `<tr><td>${item.productId}</td><td>${item.quantity}</td><td>${item.price}</td></tr>`;
        });
       
    emailContent += '</table>';
   
    await transport.sendMail({
      from:sendermail,
      to:useremail,
      subject:subject,
     html: `<h3> Gracias por su compra </h3> 
          <h4> El total de su compra es : </h4> 
          ${amount}
          <h4> El detalle de su compra es el siguiente : <h4>
          ${emailContent}
          `
    });

    
    // actualizar carrito con los productos pendientes sin stock 
    updatedCart.products = []; 

if (productsToWait.length > 0) {
  for (let n = 0; n < productsToWait.length; n++) {
    
    const itemToWait = {
      quantity: productsToWait[n].Cantidad,
      productId: productsToWait[n].ProductId
    };
    updatedCart.products.push(itemToWait); 
  }
}

      
      cartsServices.actualizarCarrito (updatedCart,cartId)

    // enviar mail del carrito pendiente de stock 
    
    if (productsToTicket.length !== 0 )  {
        subject = `Carrito de compra ${cartId}`
        emailContent = '<table border="1"><tr><th>Identificador del Producto</th><th>Cantidad</th></tr>';
        productsToWait.forEach(item => {
            emailContent += `<tr><td>${item.ProductId}</td><td>${item.Cantidad}</td></tr>`;
            });
          
        emailContent += '</table>';
      
        await transport.sendMail({
          from:sendermail,
          to:useremail,
          subject:subject,
        html: `<h3> Lamentablemente no tenemos suficiente stock para cumplir con la totalidad de su pedido </h3> 
              
              <h4> El detalle de los items pendientes es el siguiente : <h4>
              ${emailContent}
              `
        });
      } 
    let mensaje = ''
    if (productsToWait.length===0 & productsToTicket.length >0) { mensaje = 'Compra exitosa'}
    if (productsToWait.length> 0 & productsToTicket.length === 0) { mensaje = 'Todos los productos seleccionados no tienen staock, intentelo en otro momento'}
    if (productsToWait.length> 0 & productsToTicket.length >0 ) {mensaje = 'Algunos productos seleccionados no tenian stock suficiente, la compra fue efectuada , pero los remanentes quedan esperando existencias, intentelo en otro momento'}
    if (productsToWait.length===0 & productsToTicket.length === 0) { mensaje = 'Carrito vacío'}
    return res.redirect(`/carts?mensaje=${mensaje}`)
  } catch (error) {
    err=551;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError);
  }
  
}

// DELETE para eliminar un producto de un carrito 
async function eliminarProductoDelCarrito (req, res) {
  try {
    const cartId = req.params.cid;
    const productIdToFind = req.params.pid;

    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {

        const cart = await cartsServices.obtenerCarrito(cartId);

        if (!cart) {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          return;
        }

        const validObjectId = ObjectId.isValid(productIdToFind) ? new ObjectId(productIdToFind) : null;

        if (!validObjectId) { 
      
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          } 
          else {
            const indice  = cart.products.findIndex((product) => String(product.productId._id) === String(productIdToFind));
            if (indice!==-1) {
            cart.products.splice(indice,1)
            }
            else {
              err=404;
              mesageError=errorDict.getErrorMessage(err);
              level = levelErr.getLevelError(err)
              loggerWithLevel (level,mesageError)
              res.status(err).send(mesageError);
              return;
            };
          }
            await cartsServices.actualizarCarrito (cart,cartId);
            let updatedCart = cart
            err=201;
            mesageError=errorDict.getErrorMessage(err);
            level = levelErr.getLevelError(err)
            loggerWithLevel (level,mesageError)
            res.status(err).json({updatedCart});
        }
      
  } catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

// DELETE para eliminar todos los productos de un carrito 
async function eliminarTodosProductosDelCarrito (req, res) {
    try {
      const cartId = req.params.cid;

      const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
      if (!validObjectId) { 
        err=404;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
        res.status(err).send(mesageError);
        } else {

          const cart = await cartsServices.obtenerCarrito(cartId);

          if (!cart) {
            err=404;
            mesageError=errorDict.getErrorMessage(err);
            level = levelErr.getLevelError(err)
            loggerWithLevel (level,mesageError)
            res.status(err).send(mesageError);
            return;
          } else {
            cart.products.length=0;
            await cartsServices.actualizarCarrito(cart,cartId);
            err=201;
            mesageError=errorDict.getErrorMessage(err);
            level = levelErr.getLevelError(err)
            loggerWithLevel (level,mesageError)
            res.status(err).json(cart);
          }

        }
      }
      catch (error) {
        err=500;
        mesageError=errorDict.getErrorMessage(err);
        level = levelErr.getLevelError(err)
        loggerWithLevel (level,mesageError)
        res.status(err).send(mesageError,error);
    }
  };

// PUT para actualizar la cantidad de un producto de un carrito existente
async function actualizarCantidadDeUnProducto(req, res) {
  try {
    const cartId = req.params.cid;
    const productIdToFind = req.params.pid;
    const cantidad = parseInt(req.body.quantity);
    if (isNaN(cantidad) || cantidad<=0) {
      err=453;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return
    }
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=451;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      } else {        
        const cart = await cartsServices.obtenerCarrito(cartId);
        if (!cart) {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          return;
        }
        const indice  = cart.products.findIndex((product) => String(product.productId) === productIdToFind);
            if (indice!==-1) {    
              cart.products[indice].quantity=cantidad;
              await cartsServices.actualizarCarrito(cart,cartId);
              err=201;
              mesageError=errorDict.getErrorMessage(err);
              level = levelErr.getLevelError(err)
              loggerWithLevel (level,mesageError)
              res.status(err).json(cart);
            } else { 
              err=404;
              mesageError=errorDict.getErrorMessage(err);
              level = levelErr.getLevelError(err)
              loggerWithLevel (level,mesageError)
              res.status(err).send(mesageError);
              return;                    
            };
      }
  }
   catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};


// PUT para actualizar todos los elementos de un carrito
async function actualizarTodoElCarrito(req, res) {
  try {
    const cartId = req.params.cid;
    const nuevoCarrito = req.body;    
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      err=404;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).send(mesageError);
      return;
      }        
    const cart = await cartsServices.obtenerCarrito(cartId);
    if (!cart) {
          err=404;
          mesageError=errorDict.getErrorMessage(err);
          level = levelErr.getLevelError(err)
          loggerWithLevel (level,mesageError)
          res.status(err).send(mesageError);
          return;
      }
  
  if (Array.isArray(nuevoCarrito.products) && nuevoCarrito.products.length > 0) {
  
    const validacionExitosa = await Promise.all(
      nuevoCarrito.products.map(async (item) => {
              
        if (!ObjectId.isValid(item.productId)) { 
         
          return false; 
        }
     
        const productExists = await productServices.obtenerProducto(item.productId); 
 
        return productExists && typeof item.quantity === 'number' && item.quantity > 0;
      })
    );

    if (validacionExitosa.every((isValid) => isValid)) {
      cart.products=nuevoCarrito.products
    
      await cartsServices.actualizarCarrito(cart,cartId);
      err=201;
      level = levelErr.getLevelError(err)
      mesageError=errorDict.getErrorMessage(err);
      loggerWithLevel (level,mesageError)
      res.status(err).json(mesageError);
    } else {
      err=453;
      mesageError=errorDict.getErrorMessage(err);
      level = levelErr.getLevelError(err)
      loggerWithLevel (level,mesageError)
      res.status(err).json(mesageError);
    }
  } else {
    err=453;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err);
    loggerWithLevel (level,mesageError);
    res.status(err).json(mesageError);
  }
      }
   catch (error) {
    err=500;
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    res.status(err).send(mesageError,error);
  }
};

export default {getCarrito ,agregarProducto, crearCarrito,eliminarProductoDelCarrito ,procesoDeCompra, eliminarTodosProductosDelCarrito, actualizarCantidadDeUnProducto, actualizarTodoElCarrito } 
