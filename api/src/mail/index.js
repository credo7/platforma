import Email from "email-templates";

const email = new Email({
  message: {
    from: "niftylettuce@gmail.com",
  },
  // uncomment below to send emails in development/test env:
  // send: true
  transport: {
    jsonTransport: true,
  },
});

email
  .send({
    template: "power-games",
    message: {
      to: "elon@spacex.com",
    },
    locals: {
      name: "Elon",
    },
  })
  .then(console.log)
  .catch(console.error);
