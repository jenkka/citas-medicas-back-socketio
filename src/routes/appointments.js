const appointmentsRouter = require('express').Router();
const AppointmentsController = require('../controllers/appointments.controller');
const AuthController = require('../controllers/auth.controller');
const multer = require('multer');
const path = require('path');


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, '..', 'uploads', req.params.id))
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   });
// var upload = multer({ storage: storage });
// appointmentsRouter.post('/:id', AuthController.isAuthenticated, AuthController.isAdmin, upload.single('image'), (req, res) => {
//   res.status(200).send('File uploaded');
// });


appointmentsRouter.post('/:id', AuthController.isAuthenticated, AuthController.isAdmin, AppointmentsController.updateAppointment);

/**
 * @swagger
 * /api/appointments:
 *  get:
 *    description: Get all appointments in the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *    responses:
 *      200:
 *        description: Appintments successfully retrieved
 *      400:
 *        description: No appointments found
 *      500:
 *        description: Internal error
 */
appointmentsRouter.get('/', AuthController.isAuthenticated, AppointmentsController.getAllAppointments);


/**
 * @swagger
 * /api/appointments/{id}:
 *  get:
 *    description: Get single appointment from the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *      - in: path
 *        name: id
 *        description: The _id of the appointment as a string
 *    responses:
 *      200:
 *        description: Appointment successfully retrieved
 *      404:
 *        description: Appointment not found
 */
appointmentsRouter.get('/:id', AuthController.isAuthenticated, AppointmentsController.getAppointment);


/**
 * @swagger
 * /api/appointments:
 *  post:
 *    description: Create appointment
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              day:
 *                type: number
 *                description: The day of the appointment, starting from 1
 *              month:
 *                type: number
 *                description: The month of the appointment, starting from 1
 *              year:
 *                type: number
 *                description: The year of the appointment
 *              start_hour:
 *                type: number
 *                description: The hour at which the appointment starts
 *              start_minute:
 *                type: number
 *                description: The minute at which the appointment starts
 *              end_hour:
 *                type: number
 *                description: The hour at which the appointment ends
 *              end_minute:
 *                type: number
 *                description: The minute at which the appointment ends
 *              purpose:
 *                type: string
 *                description: The reason of the appointment
 *              client_username:
 *                type: string
 *                description: The username of the client
 *              doctor_username:
 *                type: string
 *                description: The username of the doctor
 *            required:
 *              - day
 *              - month
 *              - year
 *              - start_hour
 *              - start_minute
 *              - end_hour
 *              - end_minute
 *              - purpose
 *              - client_username
 *              - doctor_username
 *    responses:
 *      200:
 *        description: Appointment successfully saved in the database
 *      404:
 *        description: Client or doctor not found
 *      422:
 *        description: Fields are missing or invalid format
 *      500:
 *        description: Internal error
 */
appointmentsRouter.post('/', AuthController.isAuthenticated, AuthController.isAdmin, AppointmentsController.createAppointment);

// appointmentsRouter.post('/message/:id', AppointmentsController.addMessage);

/**
 * @swagger
 * /api/appointments/{id}:
 *  put:
 *    description: Modify existing appointment
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: id
 *        description: The _id of the appointment as a string
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              day:
 *                type: number
 *                description: The day of the appointment, starting from 1
 *              month:
 *                type: number
 *                description: The month of the appointment, starting from 1
 *              year:
 *                type: number
 *                description: The year of the appointment
 *              start_hour:
 *                type: number
 *                description: The hour at which the appointment starts
 *              start_minute:
 *                type: number
 *                description: The minute at which the appointment starts
 *              end_hour:
 *                type: number
 *                description: The hour at which the appointment ends
 *              end_minute:
 *                type: number
 *                description: The minute at which the appointment ends
 *              purpose:
 *                type: string
 *                description: The reason of the appointment
 *              client_username:
 *                type: string
 *                description: The username of the client
 *              doctor_username:
 *                type: string
 *                description: The username of the doctor
 *    responses:
 *      200:
 *        description: Appointment successfully updated
 *      404:
 *        description: Appointment not found
 *      422:
 *        description: Invalid appointment id
 *      500:
 *        description: Internal error
 */
appointmentsRouter.put('/:id', AuthController.isAuthenticated, AuthController.isAdmin, AppointmentsController.updateAppointment);


/**
 * @swagger
 * /api/appointments/{id}:
 *  delete:
 *    description: Delete appointment
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: id
 *        description: The _id of the appointment as a string
 *    responses:
 *      200:
 *        description: Appointment successfully deleted from the database
 *      404:
 *        description: Appointment not found
 *      422:
 *        description: Invalid appointment ID
 */
appointmentsRouter.delete('/:id', AuthController.isAuthenticated, AuthController.isAdmin, AppointmentsController.deleteAppointment);


module.exports = appointmentsRouter;
