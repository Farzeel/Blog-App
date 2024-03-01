class blogDTO {
    constructor(blog){
      this._id = blog._id;
    this.title = blog.title;
    this.summary = blog.summary;
    this.content = blog.content;
    this.author = blog.author;
    this.photo = blog.photoPath
    this.createdAt = blog.createdAt;

  }
}
module.exports = blogDTO;