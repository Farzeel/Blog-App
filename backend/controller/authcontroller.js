const Joi  = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const userDTO = require('../dataTransferObjects/user');
const JWTServices = require('../Services/JWTService');
const RefreshToken = require("../models/token")

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/

const authController = {

    // REGISTER CONTROLLER
    async register(req,res,next) {
       
        // VALIDATE USER INPUT
        const userRegisterSchema = Joi.object({
            name: Joi.string().min(3).max(20) .required(),
            username: Joi.string().min(5).max(20) .required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref("password")
        })
        const {error} = userRegisterSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        // if email or username already exists
        const {name,username,email,password,} = req.body;
       
        try {
         const emailInUse = await User.exists({email});
         const usernameInUse = await User.exists({username});
         
         if(emailInUse){
            const error = {
              status: 409,
              message: "Email already in use,use another email"
            }
            return next(error);
         }
         
         if(usernameInUse){
            const error = {
              status: 409,
              message: "Username already in use,use another username"
            }
            return next(error);
         }
       } 
       catch (error) {
        return next(error);
       } 
       
       // HASHE THE PASSWORD
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);

    //    INITIALZIZE VARIABLES
        let acessToken;
        let refreshToken;
        let user

       try {
       // CREATE USER
        user = new User({
           name,
           username,
           email,
           password:hashedPassword
       })
       
       // SAVE USER IN THE DATABASE
         const savedUser = await user.save();

        //  TOKEN GENERATION
        acessToken = JWTServices.signAcessToken({_id: savedUser._id},"30m");
        refreshToken = JWTServices.signRefreshToken({_id: savedUser._id},"60m");

         //    STORE REFRESH TOKEN IN THE DATBASE
          await JWTServices.storeRefreshToken(refreshToken,user._id);
       
    //    SEND ACESS TOKEN AND REFRESH TOKEN IN COOKIE
           res.cookie('access_token',acessToken,{
               maxAge: 1000*60*60*24,
             httpOnly: true,
       });
       res.cookie('refresh_token',refreshToken,{
           maxAge: 1000*60*60*24,
           httpOnly: true,
       });
        
           // create user dto object
           const userDto = new userDTO(savedUser);
        
           //    Send RESPONSE
           res.status(201).json({
               message: "User created successfully",
               user: userDto,
               auth:false
           })
       }
       catch (error) {
           return next(error);
       }   
    
   

    },
     
    // Login Controller
    async login(req,res,next) {

        // VALIDATE USER INPUT
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(20) .required(),
            password: Joi.string().pattern(passwordPattern).required()
        })
        const {error} = userLoginSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        // MATCH USERNAME AND PASSWORD
        const {username,password} = req.body;
        let user;
        
        try {
            // Find user by username
             user = await User.findOne({username});
            if(!user) {
                const error = {
                    status: 401,
                    message: "Invalid username or password"
                }
                return next(error);
            }

            // Match password
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) {
                const error = {
                    status: 401,
                    message: "Invalid username or password"
                }
                return next(error);
            }
           
        }
        catch (error) {
            return next(error);
        }

         //  TOKEN GENERATION
       const  acessToken = JWTServices.signAcessToken({_id: user._id},"30m");
         const refreshToken = JWTServices.signRefreshToken({_id: user._id},"60m");

         //  UPDATE REFRESH TOKEN IN THE DATBASE
            try {
              await  RefreshToken.updateOne(
                    {_id: user._id},
                   { token: refreshToken},
                   {upsert:true});
            } catch (error) {
                return next(error);
            }

        //SEND ACESS TOKEN AND REFRESH TOKEN IN COOKIE
            res.cookie('access_token',acessToken,{
                maxAge: 1000*60*60*24,
              httpOnly: true,
        });
        res.cookie('refresh_token',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly: true,
        });

         


        // Create userDTO
            const userDto = new userDTO(user);
       
        // Sending Response
        return res.status(200).json({user:userDto,auth:true});
     },
    
     //  logout Controller
     async logout(req,res,next) {
        // GET REFRESH TOKEN FROM COOKIE
        const refreshToken = req.cookies.refresh_token;

        // DELETE REFRESH TOKEN FROM THE DATABASE
        try {
            await RefreshToken.deleteOne({token: refreshToken});

        } catch (error) {
            return next(error);
        }
        
        // DELETE REFRESH TOKEN FROM COOKIE
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({user:null ,message:"Logged out successfully",auth:false});
     },

     //  REFRESH Controller
     async refresh(req,res,next) {
        
        // GET REFRESH TOKEN FROM COOKIE
        const refreshToken = req.cookies.refresh_token;

        // VERIFY REFRESH TOKEN IS VALID
        let id;
        try {
            id=  await JWTServices.verifyRefreshToken(refreshToken)._id;
        } catch (e) {
            const error = {
                status: 401,
                message: "Invalid refresh token"
            }
            return next(error);
        }
        try {
            const match = await RefreshToken.findOne({token: refreshToken,_id: id});
            if(!match) {
                const error = {
                    status: 401,
                    message: "UnAuthorized"
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        // GENERATE NEW REFRESH TOKEN
        const newRefreshToken = JWTServices.signRefreshToken({_id: id},"60m");
        const newAccessToken = JWTServices.signAcessToken({_id: id},"30m");

        // UPDATE REFRESH TOKEN IN THE DATABASE
        try {
            await  RefreshToken.updateOne(
                    {_id: id},
                   { token: newRefreshToken});
           
                //    SET TOKEN IN COOKIE
                res.cookie('access_token',newAccessToken,{
                    maxAge: 1000*60*60*24,
                  httpOnly: true,
                });
                res.cookie('refresh_token',newRefreshToken,{
                    maxAge: 1000*60*60*24,
                    httpOnly: true,
                });
        }
         catch (error) {
            return next(error);
        }
        const user =await User.findOne({_id: id});
        const userDto = new userDTO(user);
        return res.status(200).json({user:userDto,auth:true});
     }
}
module.exports = authController;