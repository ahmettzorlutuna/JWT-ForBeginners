const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minLength: [6, "The password be at least 6, got {VALUE}"],
  },
});

userSchema.post("save", function (doc, next) {
  console.log('User was created',doc);
  next();
});

userSchema.pre("save", function () {
    console.log('User about to be created and saved',this);
    next();
  });

const User = mongoose.model("user", userSchema);
module.exports = User;
