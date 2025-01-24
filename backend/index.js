require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/route');
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));



app.use(routes);

// app.get('/', (req,res)=>{
// res.send("Welcome to the PalCode")
// })


const PORT =process.env.PORT

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})