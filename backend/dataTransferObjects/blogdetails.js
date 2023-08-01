class blogDetailsDTO {
    constructor(blog){
      this._id = blog._id;
    this.title = blog.title;
    this.content = blog.content;
    this.photo = blog.photoPath
    this.createdAt = blog.createdAt;
    this.Author_Name = blog.author.name;
    this.Author_UserName = blog.author.username;

  }
}
module.exports = blogDetailsDTO;