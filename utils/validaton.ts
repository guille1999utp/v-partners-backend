import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const fieldsValidators = (req:Request, res:Response, next:NextFunction) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json({
     ok : false,
     errors: errors.mapped()
     });
    }
    next();
}

export default fieldsValidators;