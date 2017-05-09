var CronJob = require('cron').CronJob;
var kue = require('kue')
var queue = kue.createQueue();
var AWS = require('aws-sdk');
var sendmail = require('sendmail')();
require('dotenv').config()

// function sendSMS(params, done) {
//   AWS.config.update({
//     accessKeyId: process.env.AWS_KEY,
//     secretAccessKey: process.env.AWS_SECRET,
//     region: process.env.SNS_REGION
//   });
//
//   var sns = new AWS.SNS();
//
//   sns.publish(params, function(err, data) {
//     if (err) {
//       console.log(err.stack);
//       return;
//     }
//
//     console.log('push sent');
//     console.log(data);
//   });
//   done();
// }

function sendEmail(data, done) {
  sendmail({
    from: 'Todo@hacktive.com',
    to: 'arya.wisnu05@gmail.com',
    subject: data.data.title,
    html: data.data.message,
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
  });
  done();
}
module.exports = {
  addCron: function(data) {
    console.log(data.time);
    new CronJob(data.time, function() {
      var job = queue.create('email', {
        message: data.message,
        title: data.title,
        username: 'arya'
      }).save(function(err) {
        if (!err) console.log(job.id);
        console.log('Dorr');
      });

      var jobData = {
        message: 'Hello ' + job.data.username + ', todo hari ini' + job.data.message,
        title: job.data.title
      }

      queue.process('email', function(jobData, done) {
        sendEmail(jobData, done);
      });
    }, null, true, 'Asia/Jakarta');
  }
}
