import { checkSchema } from "express-validator";

export default checkSchema({
    firstName:{        
        isString:{
            errorMessage:"First Name must be a string"
        },
        trim:true
    },
    lastName:{      
        trim:true,
         isString:{
            errorMessage:"Last Name must be a string"
        },
    },
    email:{      
        trim:true,
        isEmail:{
            errorMessage:"Email Should be Valid Email"
        }
    },
   
})