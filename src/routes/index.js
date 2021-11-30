const router = require('express').Router();
const authRoute = require('./auth');
const clientsRoute = require('./clients');
const doctorsRoute = require('./doctors');
const appointmentsRoute = require('./appointments');

router.use('/auth', authRoute);
router.use('/clients', clientsRoute);
router.use('/doctors', doctorsRoute);
router.use('/appointments', appointmentsRoute);

module.exports = router;
