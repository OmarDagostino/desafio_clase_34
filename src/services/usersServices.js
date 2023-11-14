import {usersDataManager as DAOUsers} from "../dao/usersDataManager.js";

class UsersServices {
    constructor (daoUsers) {
        this.daoUsers= new daoUsers
    }

    async obtenerUsuarioPorEmail (direccionDeCorreo) {
        return await this.daoUsers.obtenerUsuarioPorEmail (direccionDeCorreo)
    }
    async obtenerUsuarioPorId   (id) {
      
        return await this.daoUsers.obtenerUsuarioPorId (id)
    }
    async crearUsuario  (name,email,password,typeofuser,last_name,age) {
        return await this.daoUsers.crearUsuario (name,email,password,typeofuser,last_name,age)
    }
    async obtenerUsuarioPorCartid (cartId) {
    
        return await this.daoUsers.obtenerUsuarioPorCartid (cartId)
    }


}

export const usersServices = new UsersServices (DAOUsers)