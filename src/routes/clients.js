const clientsRouter = require('express').Router();
const ClientsController = require('../controllers/clients.controller');
const AuthController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/clients:
 *  get:
 *    description: Get all clients in the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *    responses:
 *      200:
 *        description: Clients successfully retrieved
 *      400:
 *        description: No clients found
 *      500:
 *        description: Internal error
 */
clientsRouter.get('/', AuthController.isAuthenticated, ClientsController.getAllClients);


/**
 * @swagger
 * /api/clients/{username}:
 *  get:
 *    description: Get single client from the database
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must exist for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the client
 *    responses:
 *      200:
 *        description: Client successfully retrieved
 *      404:
 *        description: Client not found
 */
clientsRouter.get('/:username', AuthController.isAuthenticated, ClientsController.getClient);


/**
 * @swagger
 * /api/clients:
 *  post:
 *    description: Create client
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
 *                description: The name of the client
 *              lastname:
 *                type: string
 *                description: The last name of the client
 *              gender:
 *                type: string
 *                description: The gender of the client (Male, Female, Other)
 *              age:
 *                type: number
 *                description: The age of the client
 *              email:
 *                type: string
 *                description: A unique email
 *              password:
 *                type: string
 *                description: A combination of characters to secure the account
 *            required:
 *              - username
 *              - name
 *              - lastname
 *              - gender
 *              - age
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Client successfully saved in the database
 *      409:
 *        description: Email or username already in use
 *      422:
 *        description: Fields are missing
 *      500:
 *        description: Internal error
 */
clientsRouter.post('/', AuthController.isAuthenticated, AuthController.isAdmin, ClientsController.createClient);


/**
 * @swagger
 * /api/clients/{username}:
 *  put:
 *    description: Modify existing client
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the client
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the client
 *              lastname:
 *                type: string
 *                description: The last name of the client
 *              gender:
 *                type: string
 *                description: The gender of the client (Male, Female, Other)
 *              age:
 *                type: number
 *                description: The age of the client
 *              email:
 *                type: string
 *                description: A unique email
 *              password:
 *                type: string
 *                description: A combination of characters to secure the account
 *    responses:
 *      200:
 *        description: Client successfully updated
 *      404:
 *        description: Client not found
 *      500:
 *        description: Internal error
 */
clientsRouter.put('/:username', AuthController.isAuthenticated, AuthController.isAdmin, ClientsController.updateClient);


/**
 * @swagger
 * /api/clients/{username}:
 *  delete:
 *    description: Delete client
 *    parameters:
 *      - in: header
 *        name: auth
 *        description: Must be 'admin' for the request to work
 *      - in: path
 *        name: username
 *        description: The username of the client
 *    responses:
 *      200:
 *        description: Client successfully deleted from the database
 *      404:
 *        description: Client not found
 */
clientsRouter.delete('/:username', AuthController.isAuthenticated, AuthController.isAdmin, ClientsController.deleteClient);

module.exports = clientsRouter;
