const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const { hash } = bcrypt;
const { Schema } = mongoose;

//User model interface
// interface UserMethods{
//   isValidPassword: (password: string) => Promise<Boolean>
// }

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: [true, "This email is using by somebody."],
    lowercase: [true, "Please enter lowercase character."],
    validate: {
      validator: function (v) {
        const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,})$/;
        return emailRegex.test(v);
      },
      message: (props) => `"${props.value}" is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minLength: [6, "The password be at least 6"],
  },
});

//Password will be hash before use created.
userSchema.pre("save", async function (next) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.statics.login = async function(email,password){
  const user = await this.findOne({email}) //Found user from the DB
  if(user){
    const auth = await bcrypt.compare(password,user.password) //We make a auth compare that this users password correct with coming from login form.
    if(auth){
      console.log("user döndü")
      return user
    }
    throw Error("Password is not correct")
  }
  throw Error("This email is not registered")
}


//post middleware are executed after the hooked method and all of its pre middleware have completed.

// userSchema.post("save", function (doc, next) {
//   console.log('User was created',doc);
//   next();
// });

const User = mongoose.model("user", userSchema);
module.exports = User;
