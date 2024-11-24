const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const app = express()
const port = 3000

// Middleware to parse JSON request bodies
app.use(express.json())

// Sequelize instance (connecting to PostgreSQL)
const sequelize = new Sequelize('techeer', 'miyoung', 'miyoung', {
  host: '127.0.0.1',
  dialect: 'postgres',
})

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

// Sync the model with the database
sequelize.sync()
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.error('Error syncing database:', err))

// Create a user
app.post('/users', async (req, res) => {
  console.log(req.body)
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email
    })
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Error creating user', details: error.message })
  }
})

// Find all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error.message })
  }
})

// Find a specific user by query param `username`
app.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user', details: error.message })
  }
})

// Update a user by query param `username`
app.put('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    user.username = req.body.username
    user.email = req.body.email
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', details: error.message })
  }
})

// Delete a user by query param `username`
app.delete('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    await user.destroy()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user', details: error.message })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
