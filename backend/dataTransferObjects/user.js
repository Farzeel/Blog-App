class userDTO{
    constructor(user){
        this.user_id = user._id;
        this.name=user.username;
        this.email=user.email;     
    }
}

module.exports = userDTO;