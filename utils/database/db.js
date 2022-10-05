import mongoose from 'mongoose';

export default mongoose.connect('mongodb+srv://indekost:indekost123@cluster0.b2xowwp.mongodb.net/indekost?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.log(err);
  } else {
  console.log('Connected to database');
  }
});

