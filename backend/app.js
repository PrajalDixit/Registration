const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'prajal',
  password: 'root',
  database: 'Todo',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

const JWT_SECRET = 'your_jwt_secret_key';

app.post('/register', async (req, res) => {
  const { firstName, lastName, mobileNumber, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const query = 'CALL CreateUser(?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, mobileNumber, hashedPassword, mobileNumber], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { mobileNumber, password } = req.body;

  const query = 'SELECT * FROM registrations WHERE mobileNumber = ?';
  db.query(query, [mobileNumber], async (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const user = result[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, firstName: user.firstName, lastName: user.lastName , mobileNumber: user.mobileNumber, id:user.id  });
  });
});

app.get('/user/:id', (req, res) => {
  const query = 'CALL GetUser(?)';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.status(200).json(result[0]);
  });
});

app.put('/update/:id', async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const query = 'CALL UpdateUser(?, ?, ?, ?, ?, ?)';
    db.query(query, [req.params.id, firstName, lastName, mobileNumber, hashedPassword, mobileNumber], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json({ message: 'User updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/user/:id', (req, res) => {
  const query = 'CALL DeleteUser(?)';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3000');
});
