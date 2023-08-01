const Comment = require('../models/comment');
const Joi  = require('joi');
const commentDTO = require('../dataTransferObjects/comment');
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const CommentController = {
    async createComment(req, res,next) {
      const commentSchema = Joi.object({
        content: Joi.string().required(),
        blog: Joi.string().regex(mongodbIdPattern).required(),
        author: Joi.string().regex(mongodbIdPattern).required()
      });
      const { error } = commentSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const {content, blog, author} = req.body;
      let comment;
      try {
          comment = new Comment({
           content,
           blog,
           author
         });
         await comment.save();
      } 
      catch (error) {
        return next(error);
      }
      return res.status(201).json(comment);

    },
    
    
    async getById(req, res,next) {

        const commentByIdSchema = Joi.object({
          id: Joi.string().regex(mongodbIdPattern).required()
        });
        const { error } = commentByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }
        const {id} = req.params;
        
        let comment;
        try {
            comment = await Comment.find({blog: id}).populate("author");
        }
        catch (error) {
            return next(error);
        }

       const commentDto = comment.map(comments => new commentDTO(comments));
        return res.status(200).json({data:commentDto});

    },
};

module.exports = CommentController;