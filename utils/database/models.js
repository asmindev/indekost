import mongoose from 'mongoose'

const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    length: 8,
    minlength: 8,
    required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  created_at: Date,
})
// change _id to id
userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

const kostSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  price: {
    type: Number,
  },
  photos: {
    type: [{ url: String }],
    required: true,
  },
})

const Kost = mongoose.model('Kost', kostSchema)
const User = mongoose.model('User', userSchema)
export { User, Kost }
