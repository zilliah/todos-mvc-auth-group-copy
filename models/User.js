const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

//what info is saved for the user
// just a constructor!
const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  color: { type: Number, default: 0}
})


// Password hash middleware.
 // prevents passwords being saved in plaintext
 UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  // bcrypt hashes the password for us
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    //bcrypt hashes (or "salts") the password 
    //ie, does fancy math on it and gives what looks like a random jumbled string
    //doesn't store the password in plaintext, only the hash!
    //don';t worry about this, don't need to write from scratch!
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}


module.exports = mongoose.model('User', UserSchema)
