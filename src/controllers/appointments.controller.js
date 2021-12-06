const Database = require('../models/database.model');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const path = require('path');

 

class Appointments {
  static addMessage(id, msg) {
    if (!msg) {
      return;
    }

    if (!ObjectId.isValid(id)) {
      console.log('Invalid appointment ID');
      return;
    }

    const appointments = new Database('appointments');
    appointments.collection.findOne({ _id: ObjectId(id) })
      .then(results => {
        if (!results) {
          console.log('No appointment found.');
          return;
        } 

        appointments.collection.updateOne(
          { _id: ObjectId(id) },
          { $push: { messages: msg }}
        );
      });
  }

  static getAllAppointments(req, res) {
    const appointments = new Database('appointments');

    let username = req.query.username;
    if (username) {
      appointments.collection.find({ $or: [{ client_username: username }, { doctor_username: username }] }).toArray((err, results) => {
        if (err) {
          res.status(500).send(err);
        }
  
        if (results.length === 0) {
          res.status(404).send('No appointments found.')
        } else {
          console.log(results)
          res.status(200).send(results);
        }
      });
    } else {
      appointments.collection.find().toArray((err, results) => {
        if (err) {
          res.status(500).send(err);
        }
  
        if (results.length === 0) {
          res.status(404).send('No appointments found.')
        } else {
          console.log(results)
          res.status(200).send(results);
        }
      });
    }
  }

  static getAppointment(req, res) {
    const database = new Database('appointments');

    if (!ObjectId.isValid(req.params.id)) {
      res.status(422).send('Invalid appointment ID');
      return;
    }

    console.log('looking for appointment')
    database.collection.findOne({ _id: ObjectId(req.params.id) })
      .then(results => {
        console.log('fetch complete')

        if (!results) {
          res.status(404).send('Appointment not found.');
          return;
        }

        results.documents = results.files;
        res.status(200).send(results);
        return;


        // const directoryPath = path.join(__dirname, '..', 'uploads', req.params.id);
        // fs.readdir(directoryPath, function (err, files) {
        //   if (err) {
        //       console.log(err);
        //       return;
        //   } 
          
        //   files.forEach(function (file) {
        //     results.documents.push(file);
        //   });

        //   res.status(200).send(results);
        //   return;
        // });
      })
      .catch(err => { });
  }


  static createAppointment(req, res) {
    
    const database = new Database('appointments');

    let doc = {
      day: req.body.day,
      month: req.body.month - 1,
      year: req.body.year,
      start_hour: req.body.start_hour,
      start_minute: req.body.start_minute,
      end_hour: req.body.end_hour,
      end_minute: req.body.end_minute,
      purpose: req.body.purpose,
      client_username: req.body.client_username,
      doctor_username: req.body.doctor_username
    };

    if (Object.values(doc).includes(undefined)) {
      res.status(422).send('Fields are missing.');
      return;
    }

    const startDate = new Date(doc.year, doc.month, doc.day, doc.start_hour, doc.start_minute);
    const endDate = new Date(doc.year, doc.month, doc.day, doc.end_hour, doc.end_minute);
    doc = {
      start_date: startDate.toString(),
      end_date: endDate.toString(),
      purpose: req.body.purpose,
      client_username: req.body.client_username,
      doctor_username: req.body.doctor_username,
      messages: [],
      files: []
    }

    if (doc.start_date === 'Invalid Date' || doc.end_date === 'Invalid Date') {
      res.status(422).send('Date format is invalid.');
      return;
    }

    const clients = new Database('clients');
    clients.collection.findOne({ username: doc.client_username })
      .then(results => {
        if (!results) {
          res.status(404).send('Client not found.');
          return;
        }

        const doctors = new Database('doctors');
        doctors.collection.findOne({ username: doc.doctor_username })
          .then(results => {
            if (!results) {
              res.status(404).send('Doctor not found.');
              return;
            }

            database.collection.insertOne(doc)
              .then(results => {
                // var dir = './src/uploads/' + results.insertedId.toString();

                // if (!fs.existsSync(dir)) {
                //   console.log('Trying to create appointment');
                //   fs.mkdirSync(dir);
                // }
                console.log('appointment created');

                res.status(200).send('Appointment has been created.')
                return;
              })
              .catch(err => {
                res.status(500).send('There was an error while trying to create the appointment.');
                return;
              });
          });
      });
  }

  static updateAppointment(req, res) {
    console.log('updating appointment')
    if (!ObjectId.isValid(req.params.id)) {
      res.status(422).send('Invalid appointment ID');
      return;
    }

    delete req.body.start_date;
    delete req.body.end_date;

    let doc = {
      purpose: req.body.purpose,
      client_username: req.body.client_username,
      doctor_username: req.body.doctor_username,
      fileName: req.body.fileName
    };

    Object.keys(doc).forEach(key => {
      if (doc[key] === undefined || doc[key] === '') {
        delete doc[key];
      }
    });

    if (req.body.year || req.body.month || req.body.day || req.body.start_hour || req.body.start_minute) {
      doc.start_date = new Date(req.body.year || new Date().getFullYear(), req.body.month - 1 || 1, req.body.day || 1, req.body.start_hour || 0, req.body.start_minute || 0);
      doc.start_date = doc.start_date.toString();
    }

    if (req.body.year || req.body.month || req.body.day || req.body.end_hour || req.body.end_minute) {
      doc.end_date = new Date(req.body.year || new Date().getFullYear(), req.body.month - 1 || 1, req.body.day || 1, req.body.end_hour || 0, req.body.end_minute || 0);
      doc.end_date = doc.end_date.toString();
    }

    const database = new Database('appointments');
    database.collection.findOne({ _id: ObjectId(req.params.id) })
      .then(appointment => {
        if (!appointment) {
          res.status(404).send('Appointment not found');
          return;
        }

        if (doc.fileName) {
          doc.files = appointment.files;
          if (doc.files === undefined) {
            doc.files = []
          }
          doc.files.push(doc.fileName);
          delete doc.fileName;
        }

        if (doc.client_username === undefined) {
          doc.client_username = appointment.client_username
        }

        if (doc.doctor_username === undefined) {
          doc.doctor_username = appointment.doctor_username;
        }

        const clients = new Database('clients');
        clients.collection.findOne({ username: doc.client_username })
          .then(client => {
            if (!client) {
              res.status(404).send('Client not found.');
              return;
            }

            const doctors = new Database('doctors');
            doctors.collection.findOne({ username: doc.doctor_username })
              .then(doctor => {
                if (!doctor) {
                  res.status(404).send('Doctor not found.');
                  return;
                }

                database.collection.updateOne(
                  { _id: ObjectId(req.params.id) },
                  { $set: doc })
                  .then(results => {
                    if (results.matchedCount <= 0) {
                      res.status(404).send('Appointment not found.');
                      return;
                    }

                    res.status(200).send('Appointment has been updated.');
                    return;
                  })
                  .catch(err => {
                    res.status(500).send(err);
                    return;
                  });
              })
          })
      });
  }

  static deleteAppointment(req, res) {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(422).send('Invalid appointment ID');
      return;
    }

    const database = new Database('appointments');
    database.collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(results => {
        if (results.deletedCount > 0) {
          res.status(200).send('Appointment has been deleted.');
        } else {
          res.status(404).send('Appointment not found.');
        }
      })
      .catch(err => { });
  }
}

module.exports = Appointments;
