require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const settingsRoutes = require('./routes/api');
const loginRoutes = require('./routes/login');
const run = require('./services/kafka');
const PORT = process.env.PORT;
const { sequelize, createDefaultValues } = require('./db/db');
const authentication = require('./middleware/auth');

//joku muu tapa tälle?
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use('/settings', authentication, settingsRoutes);
app.use(loginRoutes);


startServer = async () => {
  await sequelize.sync();

  await createDefaultValues();

  run().catch(console.error);

  app.listen(PORT, () => {
    console.log('Server is listening on port:', PORT);
  });
};
startServer();
