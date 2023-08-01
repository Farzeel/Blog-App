const Jwt = require('jsonwebtoken');
const {SIGN_ACESS_TOKEN,SIGN_REFRESH_TOKEN} = require("../config/index")
const RefreshToken = require("../models/token")

class JWTServices{
    
    // SIGN ACESS TOKEN
    static signAcessToken(payload,expirytime){
           
        return Jwt.sign(payload,SIGN_ACESS_TOKEN,{expiresIn:expirytime})
     
    }

    // REFRESH ACESS TOKEN
   static signRefreshToken(payload,expirytime){
     
        return Jwt.sign(payload,SIGN_REFRESH_TOKEN,{expiresIn:expirytime})
      
    }

    // VERIFY ACESS TOKEN
    static verifyAcessToken(token){
    
       return Jwt.verify(token,SIGN_ACESS_TOKEN)
        
    }

    // verify REFRESH TOKEN
    static verifyRefreshToken(token){
       
        return Jwt.verify(token,SIGN_REFRESH_TOKEN)
      
    }

    // STORE REFRESH TOKEN in DATABASE
    static async storeRefreshToken(token, userid){
       try {
        const newToken = new RefreshToken({
            token,
            userid
        })
        await newToken.save()
       } catch (error) {
        console.log(error)
       }
    }
}

module.exports = JWTServices