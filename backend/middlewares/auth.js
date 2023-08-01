const userDTO = require('../dataTransferObjects/user');
const JWTServices = require('../Services/JWTService');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
        const acessToken = req.cookies.access_token;
    // REFRESH ACEES TOKEN VALIDATION
    try {
        
        if(!refreshToken || !acessToken) {
            const error = {
                status: 401,
                message: 'Unauthorized'
            }
            return next (error)
        }
        
    } catch (error) {
        return next (error)
    }

    let _id;

    // VERIFY ACCESS TOKEN IS VALID
        try {
            _id = JWTServices.verifyAcessToken(acessToken)._id
            
            
        } catch (error) {
            return next (error)
        }
        let user;
        try {
            // DELETE USER FROM DB
            user = await User.findOne({_id: _id});

        } catch (error) {
            return next (error)
        }
        const userDto = new userDTO(user);
        req.user = userDto;
        next();
}

module.exports = auth;