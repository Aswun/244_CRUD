const express = require('express');
let mysql = require('mysql');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bil1o8775',
  database: 'biodata',
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connection successful!');
});

app.get('/api/mahasiswa', (req, res) => {
  db.query('SELECT * FROM mahasiswa', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.json(results);
  });
});

app.post('/api/mahasiswa', (req, res) => {
  const { nama, nim, kelas, prodi } = req.body;
  if (!nama || !nim || !kelas || !prodi) {
    return res.status(400).send( { message: 'nama, nim, kelas, and prodi are required' } );
  }

  db.query('INSERT INTO mahasiswa (nama, nim, kelas, prodi) VALUES (?, ?, ?, ?)', [nama, nim, kelas, prodi], 
    (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    res.status(201).send('Data inserted successfully');
  });
});

app.put('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas, prodi } = req.body;
  db.query('UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ?, prodi = ? WHERE idmahasiswa = ?',
    [nama, nim, kelas, prodi, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error updating data');
        return;
      }
      res.send('Data updated successfully');
    });
});
