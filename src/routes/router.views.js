import express from 'express';
import handlebars from 'express-handlebars';
import {Router} from 'express';
import path from 'path';
import {authUser,auth,auth2 } from '../middlewares/authMiddle.js';
import __dirname from '../util.js';
import {cartModel} from '../models/cart.model.js';
import {productModel} from '../models/product.model.js';
import { ObjectId } from 'mongodb';

const router = express.Router()

// mostrarMenu maneja la renderizacion de los items del menu segun corresponda (con true o false)
//
// 0 => Home
// 1 => Registro
// 2 => Login
// 3 => Login con Git Hub
// 4 => Mostrar datos del usuario
// 5 => Productos
// 6 => Carrito 
// 7 => Logout
// 8 => volver al menu del administrador
// 9 => Chat de usuarios

let mostrarMenu0 = true;
let mostrarMenu1 = true;
let mostrarMenu2 = true;
let mostrarMenu3 = true;
let mostrarMenu4 = true;
let mostrarMenu5 = true;
let mostrarMenu6 = true;
let mostrarMenu7 = true;
let mostrarMenu8 = true;
let mostrarMenu9 = true;


const app = express();
app.engine('handlebars',handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// ruta para la vista de Home Page
router.get('/', auth, (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=true;
  mostrarMenu2=true;
  mostrarMenu3=true;
  mostrarMenu4=true;
  mostrarMenu5=true;
  mostrarMenu6=true;
  mostrarMenu7=true;
  mostrarMenu8=false;
  mostrarMenu9=true;

  let typeofuser=req.session.usuario.typeofuser

    res.setHeader('Content-Type','text/html');
    res.status(200).render('home',{typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  });

  // ruta para la vista del administrador
  router.get('/admin', auth, (req,res)=>{
    mostrarMenu0=false;
    mostrarMenu1=false;
    mostrarMenu2=false;
    mostrarMenu3=false;
    mostrarMenu4=false;
    mostrarMenu5=false;
    mostrarMenu6=false;
    mostrarMenu7=true;
    mostrarMenu8=false;
    mostrarMenu9=false;
    let typeofuser=req.session.usuario.typeofuser
  
  
      res.setHeader('Content-Type','text/html');
      res.status(200).render('admin',{typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
    });

// ruta para la vista de visualizar productos para el administrador
router.get('/visualizarProductos',auth,async (req,res)=> {
  mostrarMenu0=false;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=true;
  mostrarMenu8=true;
  mostrarMenu9=false;
  let typeofuser=req.session.usuario.typeofuser;
  const product = await productModel.find({}).exec();
  const renderedProducts = product.map(product => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          code: product.code,
          category: product.category,
          stock: product.stock
        }})

  res.setHeader('Content-Type','text/html');
  res.status(200).render('visualizarProductos',{renderedProducts, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  
})

// ruta para crear producto nuevo
router.get('/crearProducto',auth,async (req,res)=> {
  mostrarMenu0=false;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=true;
  mostrarMenu8=true;
  mostrarMenu9=false;
  let typeofuser=req.session.usuario.typeofuser;
  
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
  res.setHeader('Content-Type','text/html');   
  if (error) {res.status(400).render('crearProducto',{error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  } else {
    {res.status(200).render('crearProducto',{error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});

  }

}})

// ruta para modificar productos
router.get('/modificarProductos',auth,async (req,res)=> {
  mostrarMenu0=false;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=true;
  mostrarMenu8=true;
  mostrarMenu9=false;
  let typeofuser=req.session.usuario.typeofuser;
  
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
  const product = await productModel.find({}).exec();
  const renderedProducts = product.map(product => {
    return {
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      category: product.category,
      stock: product.stock
    }});

  res.setHeader('Content-Type','text/html');   
  if (error) {res.status(400).render('modificarProductos',{renderedProducts,error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  } else {
    {res.status(200).render('modificarProductos',{renderedProducts,error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});

  }

}})

// ruta para modificar un producto
router.get('/modificarProducto',auth,async (req,res)=> {
  mostrarMenu0=false;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=true;
  mostrarMenu8=true;
  mostrarMenu9=false;
  let typeofuser=req.session.usuario.typeofuser;
  
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
  let productId=req.query.productId
  const product = await productModel.findOne({ _id: productId }).exec();
  
  const code=product.code
  const title=product.title
  const description=product.description
  const price= product.price
  const stock= product.stock
  const category=product.category
  const status=product.status
  const thumbnail = product.thumbnail
  res.setHeader('Content-Type','text/html');   
  res.status(200).render('modificarProducto',{code,title,description,price,stock,category,status,thumbnail,productId,error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});

})

// ruta para eliminar un producto 
router.get('/borrarProductos',auth,async (req,res)=> {
  mostrarMenu0=false;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=true;
  mostrarMenu8=true;
  mostrarMenu9=false;
  let typeofuser=req.session.usuario.typeofuser;
  
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
  const product = await productModel.find({}).exec();
  const renderedProducts = product.map(product => {
    return {
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      category: product.category,
      stock: product.stock
    }});

  res.setHeader('Content-Type','text/html');   
  if (error) {res.status(400).render('borrarProductos',{renderedProducts,error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  } else {
    {res.status(200).render('borrarProductos',{renderedProducts,error,errorDetail, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});

  }

}})

// ruta para la vista del LOGIN
router.get('/login', auth2, (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=true;
  mostrarMenu2=false;
  mostrarMenu3=true;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=false;
  mostrarMenu8=false;
  mostrarMenu9=false;
  let typeofuser='' ;
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
    res.setHeader('Content-Type','text/html');
    res.status(200).render('login',{error,errorDetail,typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  });

// ruta para la vista del LOGIN con github

router.get('/loginGitHub', auth2, (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=true;
  mostrarMenu2=true;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=false;
  mostrarMenu8=false;
  mostrarMenu9=false;
  let typeofuser='' ;
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
    res.setHeader('Content-Type','text/html');
    res.status(200).render('loginGitHub',{error,errorDetail,typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  });


// ruta para la vista del registro de usuario
router.get('/registro',auth2,  (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=false;
  mostrarMenu2=true;
  mostrarMenu3=true;
  mostrarMenu4=false;
  mostrarMenu5=false;
  mostrarMenu6=false;
  mostrarMenu7=false;
  mostrarMenu8=false;
  mostrarMenu9=false;
  let typeofuser='';
  let error= false
  let errorDetail = ''
  if (req.query.error){
    error=true,
    errorDetail=req.query.error
  }
    res.setHeader('Content-Type','text/html');
    res.status(200).render('registro',{error, errorDetail, typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  })

  // ruta para mostrar el registro del usuario que hizo login
router.get('/current1',auth,  (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=true;
  mostrarMenu6=true;
  mostrarMenu7=true;
  mostrarMenu8=false;
  mostrarMenu9=true;

  // DTO de datos del usuario

  let name=req.user.name
  let last_name= req.user.last_name
  let email=req.user.email
  let age=req.user.age
  let cartId=req.user.cartId
  let typeofuser=req.user.typeofuser

    res.setHeader('Content-Type','text/html');
    res.status(200).render('current1',{name, last_name, email, age, cartId,mostrarMenu0,typeofuser,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  })

// ruta para el chat
router.get('/chat',authUser, (req,res)=> {
  mostrarMenu0=true;
  mostrarMenu1=false;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=true;
  mostrarMenu6=true;
  mostrarMenu7=true;
  mostrarMenu8=false;
  mostrarMenu9=false;
    let email=req.user.email 
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat',{email,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9});
  })

// ruta para mostrar los productos a un usuario
router.get('/products', auth,  async (req,res) => {
    try {
     
      const name = req.session.usuario.name
      const cartId = req.session.usuario.cartId
      const product = await productModel.find({}).exec();
      const renderedProducts = product.map(product => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          code: product.code,
          category: product.category,
          stock: product.stock
        };
        
      });
      res.setHeader('Content-Type', 'text/html');
      mostrarMenu0=true;
      mostrarMenu1=false;
      mostrarMenu2=false;
      mostrarMenu3=false;
      mostrarMenu4=true;
      mostrarMenu5=false;
      mostrarMenu6=true;
      mostrarMenu7=true;
      mostrarMenu8=false;
      mostrarMenu9=true;
      let typeofuser=req.session.usuario.typeofuser;
      
      res.status(200).render('products', { renderedProducts,name, cartId, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9}); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  })
 
// Ruta para mostrar el contenido de un carrito por su _id
router.get('/carts/:cid',  async (req,res)  => { 
      try {
      const cartId = req.params.cid;
      const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador del carrito invalido");
        } else {
          const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId').exec();
          
          if (cart) {
                  
            const transformedCart = {
              cartId,
              products: cart.products.map(product => ({
                productId: product.productId._id,
                title: product.productId.title,
                description: product.productId.description,
                price: product.productId.price,
                code: product.productId.code,
                stock: product.productId.stock,
                category: product.productId.category,
                cantidad: product.quantity,
              })),
            };
          
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carts', { cart: transformedCart });
          } else {
            res.status(404).send('Carrito no encontrado');
          }
        }
    } catch (error) {
      console.error(error)
      res.status(500).send('*** Error en el servidor');
    }
   
  });

// ruta para mostrar el contenido del carrito del usuario que hizo Login
router.get('/carts', auth, async (req,res)  => { 
    try {
    const cartId = req.session.usuario.cartId;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId').exec();
        
        if (cart) {
                
          const transformedCart = {
            cartId,
            products: cart.products.map(product => ({
              productId: product.productId._id,
              title: product.productId.title,
              description: product.productId.description,
              price: product.productId.price,
              code: product.productId.code,
              stock: product.productId.stock,
              category: product.productId.category,
              cantidad: product.quantity,
            })),
          };
          mostrarMenu0=true;
          mostrarMenu1=false;
          mostrarMenu2=false;
          mostrarMenu3=false;
          mostrarMenu4=true;
          mostrarMenu5=true;
          mostrarMenu6=false;
          mostrarMenu7=true;
          mostrarMenu8=false;
          mostrarMenu9=true;
          let typeofuser=req.session.usuario.typeofuser;

          let mensaje= req.query.mensaje
          res.setHeader('Content-Type', 'text/html');
          res.status(200).render('carts', { cart: transformedCart, mensaje, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5,mostrarMenu6,mostrarMenu7,mostrarMenu8,mostrarMenu9 });
        } else {
          res.status(404).send('Carrito no encontrado');
        }
      }
  } catch (error) {
    console.error(error)
    res.status(500).send('*** Error en el servidor');
  }
 
});

  export default router;