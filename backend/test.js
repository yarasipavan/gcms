const mailgun = require("mailgun-js")({
  apiKey: "c648bde6a9f95d7e618d231f45e170f5-af778b4b-0f8bb2d1",
  domain: "sandboxa059a6b80f29480d83835011b9a1e120.mailgun.org",
});
const emailData = {
  from: "Admin <yarasipavaniiit@gmail.com>",
  to: "yarasipavan@gmail.com",
  subject: "Hello from Mailgun.js",
  text: "This is the plaintext body of the email",
};

const sendMail = () => {
  mailgun.messages().send(emailData, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};
sendMail();
