const express = require('express')
const res = require('express/lib/response')
const db = require('./server/config/db')
const cors = require('cors')
const app = express()
const PORT = 3011;
const apiRoutes = require('./server/routes/apiRoutes')

app.use(cors());
app.use(express.static(__dirname + '/server/public/'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 500000000 }));
app.get('/', (req, res) => {
    res.send('Welcome to Sports Ecommerce Server')
})

app.use('/api', apiRoutes)



require('./server/config/seed')
app.listen(PORT, () => {
    console.log("Server Listerning to port ", PORT)
})
