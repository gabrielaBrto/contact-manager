const express = require('express');
const connectDB = require('./config/db');

const app = express();

//CONNECT DATABASE
//https://github.com/bradtraversy/contact-keeper/blob/master/routes/contacts.js
//https://cloud.mongodb.com/v2/63a64a04e24b6716cc65db30#/clusters/connect?clusterId=ContactManager
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