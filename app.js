const apiRoutes = require('./src/routes');

const express = require('express');
const app = express();
const router = express.Router();

const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');
const passport = require('passport');

const socketIo = require('socket.io');

const AppointmentsController = require('./src/controllers/appointments.controller');

const MongoStore = require('connect-mongo');
const Database = require('./src/models/database.model');
const MongoClient = require('mongodb').MongoClient;

if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}
require('dotenv').config();
require('./passport-config')(passport);

const port = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });


app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.send('Application works!');
});

app.use(router);
app.use('/api', apiRoutes);


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const appointmentsRouter = require('./src/routes/appointments');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            "title": "Online Medical Appointments",
            "description": "Practica 3 de PAE - Integrantes: Juan Carlos Gonzalez, Erick Eduardo Gamboa, Juan Manuel Lazcano",
            "version": "1.0.0",
            "servers": ['http://localhost:' + port],
            "contact": {
                "name": "JCGG",
                "email": "is724397@iteso.mx"
            }
        },
    },
    apis: [
        'app.js',
        'src/routes/auth.js',
        'src/routes/appointments.js',
        'src/routes/doctors.js',
        'src/routes/clients.js'
    ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true
}, function(err, client) {
    if(err) {
        console.log('Failed to connect to MongoDB', err);
    } else {
        console.log('Connected to database');
        database = client.db(process.env.MONGO_DATABASE);
        Database.setDatabase(database);

        const server = app.listen(port, () => {
            console.log('App is listening in port ' + port);
        });

        const io = socketIo(server, {
            cors: {
                origin: 'https://mymedicalappointments.herokuapp.com',
                methods: ['GET', 'POST']
                // allowHeaders: ['x-auth'],
                // credentials: true
            }
        });

        io.on('connection', socket => {
            console.log('Someone has connected.');
            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
                console.log('connected to', roomId)
            });

            socket.on('disconnect', () => {
                console.log('Someone has disconnected.');
            });

            socket.on('newMessage', (roomId, msg) => {
                console.log('New message received:', msg);
                console.log('the room',roomId)
                AppointmentsController.addMessage(roomId, msg);
                socket.to(roomId).emit('newMessage', msg);
            });
        });
    }
});

