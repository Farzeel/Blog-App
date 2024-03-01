const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Joi  = require('joi');
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const fs = require('fs');
const {BACKEND_SERVER_PATH} = require("../config/index");
const blogDTO = require('../dataTransferObjects/blog');
const blogDetailsDTO = require('../dataTransferObjects/blogdetails');
const blogController = {
    // CREATE CONTROLLER
    async create(req, res,next){
          const blogSchema = Joi.object({
            title: Joi.string().min(5).required(),
            summary: Joi.string().required(),
            content: Joi.string().min(200).required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string().required(),
            
          });
          const {error} = blogSchema.validate(req.body);
          if(error){
              return next(error) 
          }

          // DESTRUCTURING BLOG OBJECT
          const{title,content,author,photo,summary} = req.body;

         // HANDLE IMAGE STORAGE AND NAMING VIA BUFFER
       const buffer =   Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        
         //  GIVE RANDOM NAME TO THE IMAGE
         const imageName = `${Date.now()}-${author}.png`;

        //  SAVE IMAGE TO THE STORAGE
        try {
          fs.writeFileSync(`storage/${imageName}`, buffer);
        } 
        catch (error) {
          return next(error);
        }

        //  ADD DATA TO THE BLOG COLLECTION
        let newBlog;
        try {
          newBlog = new Blog({
              title,
              content,
              author,
              summary,
              photoPath: `${BACKEND_SERVER_PATH}/storage/${imageName}`,
              
          });
           await newBlog.save()
          
        } 
        catch (error) {
          return next(error);
        }

        // MAKING BLOG DTO OBJECT
        const blogDto  =new blogDTO(newBlog)
        
         // RETURN BLOG DTO
        return res.status(201).json({blog:blogDto});

    },
    
    // GET ALL BLOG CONTROLLER
    async getAll(req, res,next){
      try {
        // GET ALL BLOGS USING FIND QUERY
        const blogs = await Blog.find();
        // MAKE BLOG DTO OBJECT
        const blogDtos = blogs.map(blog => new blogDTO(blog));
        // RETURN BLOG DTO
        return res.status(200).json({blogs:blogDtos});
      } catch (error) {
        return next(error)
      }
    },
    
    // GET BLOG BY ID CONTROLLER
    async getById(req, res,next){

      // VLAIDATE THE ID
      const blogSchema = Joi.object({
        id: Joi.string().regex(mongodbIdPattern).required(),
      });
      const {error} = blogSchema.validate(req.params);
      if(error){
          return next(error) 
      }

      // DESTRUCTURING THE ID
      const {id} = req.params;

      // GET THE BLOG BY ID UING THE FINDONE QUERY 
      try {
        const blog = await Blog.findById(id).populate("author");
        
        // MAKE BLOG DTO OBJECT
        const blogDetailsDto = new blogDetailsDTO(blog);
        
        // RETURN BLOG DTO
        return res.status(200).json({blog:blogDetailsDto});
      }
       catch (error) {
        return next(error)
      }
    },
    
    // UPDATE BLOG CONTROLLER
    async update(req, res,next){

      // Validate blog
      const updateBlogSchema = Joi.object({
        title: Joi.string().min(5).required(),
        content: Joi.string().min(200).required(),
        summary: Joi.string().required(),
        author: Joi.string().regex(mongodbIdPattern),
        blogId: Joi.string().regex(mongodbIdPattern).required(),
        photo: Joi.string(),
      });
      const {error} = updateBlogSchema.validate(req.body);
      if(error){
          return next(error) 
      }

      const {title,content,author,blogId,photo,summary} = req.body;

     let blog;
     try {
      blog = await Blog.findOne({_id: blogId});
     } catch (error) {
      return next(error)
     }

     if(photo){
      let previousPhoto = blog.photoPath;
      previousPhoto =  previousPhoto.split("/").at(-1);

      // delete Photo
      try {
        fs.unlinkSync(`storage/${previousPhoto}`);
      } catch (error) {
        return next(error);
      }
      // store new Photo
      const buffer =   Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
      const imageName = `${Date.now()}-${author}.png`;
      try {
        fs.writeFileSync(`storage/${imageName}`, buffer);
      } catch (error) {
        return next(error);
      }
      // update database
      await Blog.updateOne({_id: blogId},{
        title,
        summary,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imageName}`,
      })
     }
     else{
      await Blog.updateOne({_id: blogId},{
        title,
        content,
        summary,
      })
     }
    //  send response
    return res.status(200).json({message:"Blog updated successfully"});

    },
    
    // DELETE BLOG CONTROLLER 
    async delete(req, res,next){
      // validate the id
      const deleteBlogSchema = Joi.object({
        id: Joi.string().regex(mongodbIdPattern).required(),
      });
      const {error} = deleteBlogSchema.validate(req.params);
      if(error){
          return next(error) 
      }
      const {id} = req.params;
      try {
        await Blog.deleteOne({_id: id});
        await Comment.deleteMany({blog: id});
      } catch (error) {
        return next(error);
      }
      return res.status(200).json({message:"Blog deleted successfully"});
    },

}

module.exports = blogController