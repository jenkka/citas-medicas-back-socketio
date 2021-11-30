const doctorsRouter = require('express').Router();
const DoctorsController = require('../controllers/doctors.controller');
const AuthController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/doctors:
 *  get:
 *    description: Get all doctors in the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *    responses:
 *      200:
 *        description: Doctors successfully retrieved
 *      400:
 *        description: No doctors found
 *      500:
 *        description: Internal error
 */
doctorsRouter.get('/', AuthController.isAuthenticated, DoctorsController.getAllDoctors);


/**
 * @swagger
 * /api/doctors/{username}:
 *  get:
 *    description: Get single doctor from the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the doctor
 *    responses:
 *      200:
 *        description: Doctor successfully retrieved
 *      404:
 *        description: Doctor not found
 */
doctorsRouter.get('/:username', AuthController.isAuthenticated, DoctorsController.getDoctor);


/**
 * @swagger
 * /api/doctors:
 *  post:
 *    description: Create doctor
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
 *              username:
 *                type: string
 *                description: A unique username
 *              name:
 *                type: string
 *                description: The name of the doctor
 *              lastname:
 *                type: string
 *                description: The last name of the doctor
 *              gender:
 *                type: string
 *                description: The gender of the doctor (Male, Female, Other)
 *              age:
 *                type: number
 *                description: The age of the doctor
 *              email:
 *                type: string
 *                description: A unique email
 *              password:
 *                type: string
 *                description: A combination of characters to secure the account
 *              specialty:
 *                type: string
 *                description: The field in which the doctor specializes
 *            required:
 *              - username
 *              - name
 *              - lastname
 *              - gender
 *              - age
 *              - email
 *              - password
 *              - specialty
 *    responses:
 *      200:
 *        description: Doctor successfully saved in the database
 *      409:
 *        description: Email or username already in use
 *      422:
 *        description: Fields are missing
 *      500:
 *        description: Internal error
 */
doctorsRouter.post('/', AuthController.isAuthenticated, AuthController.isAdmin, DoctorsController.createDoctor);


/**
 * @swagger
 * /api/doctors/{username}:
 *  put:
 *    description: Modify existing doctor
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the doctor
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the doctor
 *              lastname:
 *                type: string
 *                description: The last name of the doctor
 *              gender:
 *                type: string
 *                description: The gender of the doctor (Male, Female, Other)
 *              age:
 *                type: number
 *                description: The age of the doctor
 *              email:
 *                type: string
 *                description: A unique email
 *              password:
 *                type: string
 *                description: A combination of characters to secure the account
 *              specialty:
 *                type: string
 *                description: The field in which the doctor specializes
 *    responses:
 *      200:
 *        description: Doctor successfully updated
 *      404:
 *        description: Doctor not found
 *      500:
 *        description: Internal error
 */
doctorsRouter.put('/:username', AuthController.isAuthenticated, AuthController.isAdmin, DoctorsController.updateDoctor);


/**
 * @swagger
 * /api/doctors/{username}:
 *  delete:
 *    description: Delete doctor
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the doctor
 *    responses:
 *      200:
 *        description: Doctor successfully deleted from the database
 *      404:
 *        description: Doctor not found
 */
doctorsRouter.delete('/:username', AuthController.isAuthenticated, AuthController.isAdmin, DoctorsController.deleteDoctor);


module.exports = doctorsRouter;
