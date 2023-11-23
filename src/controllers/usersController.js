import {Router} from 'express'
import bodyParser from 'body-parser'
import {config} from '../config/config.js'
export const router = Router ()

router.use(bodyParser.urlencoded({ extended: true }));

// Login con email con error

async function errorLogin (req,res)  {
    res.redirect('/login?error=Login con error')    
    };

// Login de Git Hub con error

async function errorLoginGitHub (req,res) {
    res.redirect('/loginGitHub?error=**Login con error**')    
    };

// registro con error

async function errorRegistro (req,res) {
    res.redirect('/registro?error=Error de registro')    
    };

// Login de un usuario o del administrador
async function Login (req, res, next) {
    
    req.session.usuario = req.user;
    
    req.session.admin = false;

    if (req.user && req.user.email === config.EMAIL_ADMINISTRADOR) {
      // Establece una propiedad 'admin' en la sesión para identificar al administrador
      req.session.admin = true;
    }
  
    if (req.session.admin) {
      return res.redirect('/admin'); // Redirige al administrador
    } else {
      return res.redirect('/products'); // Redirige al usuario
    }
  };


// logOut

async function logout(req,res) {

   
    await req.session.destroy(e=> console.error(e)),
  
    res.redirect('/login?mensaje=logout correcto... !')

}

// mostrar los datos del usuario que esta registrado

async function current (req,res) {
  const usuario= req.dto.usuario 
  return res.status(200).json({usuario})

}

// mostrar los datos del usuario que esta registrado con handlebars

async function current1 (req,res) {
  
  return res.redirect('./current')
}
  
  export default {errorLogin, errorLoginGitHub, errorRegistro, Login ,logout, current, current1}