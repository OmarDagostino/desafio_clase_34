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

const loggerTest = (req, res) => {
    err="aaa";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    err="bbb";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    err="ccc";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    err="ddd";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    err="eee";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
    err="fff";
    mesageError=errorDict.getErrorMessage(err);
    level = levelErr.getLevelError(err)
    loggerWithLevel (level,mesageError)
  
  res.send('Logs probados. Verifica la consola del servidor si estas en modo de desarrollo o el archivo errors.log si estas en modo de producción.');

};

export default { loggerTest };
