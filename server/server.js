const io = require("socket.io")(3030, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  // console.log(id, "id");
  socket.join(id);

  socket.on("send-message", ({ recipients, message, gcid }) => {
    // console.log(gcid.id);
    recipients.forEach((recipient) => {
      // console.log(recipient);

      const newRecipients = recipients.filter((r) => r.id !== recipient.id);
      if (gcid.peerid.match(/(19):/)) {
        newRecipients.push(id);
        // console.log(newRecipients, id, recipient.id);

        socket.broadcast.to(recipient.id).emit("receive-message", {
          recipients: newRecipients,
          sender: gcid.peerid,
          message,
        });
      } else {
        newRecipients.push(id);
        // console.log(newRecipients, id, recipient.id);

        socket.broadcast.to(recipient.id).emit("receive-message", {
          recipients: newRecipients,
          sender: id,
          message,
        });
      }
    });
  });
});

/*

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  // console.log(id, "id");
  socket.join(id);

  socket.on("send-message", ({ recipients, message }) => {
    // console.log(recipients);
    recipients.forEach((recipient) => {
      // console.log(recipient);
      const newRecipients = recipients.filter((r) => r.id !== recipient.id);

      newRecipients.push(id);

      console.log(newRecipients, " new ");
      // console.log(recipient.id, " recipients");
      socket.broadcast.to(recipient.id).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        message,
      });
      
    });
  });
});

*/
