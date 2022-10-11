import { Kost } from '../../utils/database/models.js'

const Add = async (req, res) => {
  const { user } = req.session
  res.render('add', { title: 'Add', layout: 'layouts/main', user })
}

const Post = async (req, res) => {
  const { nama, alamat, phone } = req.body
  const { user } = req.session
  const { file } = req.files
  const fileName = file.name
  const fileExtension = fileName.split('.').pop()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
  if (allowedExtensions.includes(fileExtension)) {
    const url = `uploads/images/${fileName}`
    file.mv(`public/uploads/images/${fileName}`, async (err) => {
      if (err) {
        res.json({ status: 'error', message: 'Failed to upload file' })
      } else {
        const kost = new Kost({
          name: nama,
          address: alamat,
          phone,
          photos: [{ url }],
        })
        try {
          await kost.save()
          res.render('uploadSuccess', {
            title: 'Upload Success',
            layout: 'layouts/main',
            user,
          })
        } catch (error) {
          res.status(400).json({ status: 'error', message: error })
        }
      }
    })
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid file type' })
  }
}

export { Post, Add }
