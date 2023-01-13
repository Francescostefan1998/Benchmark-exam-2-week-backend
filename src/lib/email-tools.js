import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENGRID_KEY);

export const sendRegistrationEmail = async (recipientAddress) => {
  console.log("send reg triggered");
  console.log(recipientAddress);
  console.log(process.env.SENDER_EMAIL);
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello, you have been registered",
    text: "from now we are going to retrive $5 every 2 month",
    html: "<strong>from now we are going to retrive $5 every week</strong>",
  };
  console.log(msg.to, msg.from);

  await sgMail.send(msg);
  console.log("completed");
};
