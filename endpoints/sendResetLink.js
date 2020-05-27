const { sendEmail } = require('./sendEmail');
const Response = require('../api/Response');
const User = require('../models/User');
const Code = require('../models/Code');

module.exports = {
  sendResetLink(req, res) {
    let userExists = User.exists({ email: req.body.email })
      .then((response) => {
        if (!response) {
          res.send(new Response(false, null, 'This account does not exist.'));
        } else {
          // Ensure form data is stringified
          let email = req.body.email.toString();

          // Function to generate random code (16 digits, 0-9)
          function generateCode() {
            let code = '';
            for (let i = 0; i < 16; i++) {
              code += Math.floor(Math.random() * 10);
            }
            return code;
          }

          // Generate the reset code
          let code = generateCode();

          // Create DB entry
          const newCode = new Code({
            email,
            code
          });

          // Save
          newCode.save();

          // Initiate a process on a timer to delete the above DB entry
          setTimeout(() => {
            Code.deleteOne({ code })
              .then((response) => {
                console.log('Deleted a reset code');
              })
              .catch((err) => console.log(err));
          }, 600000); // 10 minutes as ms

          sendEmail(
            req.body.email,
            'My Game Chest password reset link',
            `A password reset link has been requested for this account. <a href="${process.env.APP_URL}/confirm-email/${code}">Click here</a> to set a new password.<br /><br />Regards,<br />My Game Chest`
          );
          res.send(
            new Response(
              true,
              null,
              'Reset link sent. If you cannot see the email, check your spam folder. The link will expire in 10 minutes.'
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }
};
