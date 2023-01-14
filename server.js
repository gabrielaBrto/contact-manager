const express = require('express');
const connectDB = require('./config/db');

const app = express();

//CONNECT DATABASE
connectDB();

//INITI MIDDLEWARE
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: 'Hello World' }));

//ROUTES
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
