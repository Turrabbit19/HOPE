import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";

const SentEmails = () => {
  const [emails, setEmails] = useState([]);

  const fetchSentEmails = () => {
    gapi.client.gmail.users.messages
      .list({
        userId: "me",
        labelIds: ["SENT"],
      })
      .then((response) => {
        const messages = response.result.messages || [];
        if (messages.length) {
          const emailPromises = messages.map((message) =>
            gapi.client.gmail.users.messages.get({
              userId: "me",
              id: message.id,
            })
          );
          Promise.all(emailPromises).then((emailResponses) => {
            setEmails(emailResponses.map((email) => email.result.snippet));
          });
        }
      });
  };

  useEffect(() => {
    fetchSentEmails();
  }, []);

  return (
    <div>
      <h2>Sent Emails</h2>
      <ul>
        {emails.length > 0 ? (
          emails.map((email, index) => <li key={index}>{email}</li>)
        ) : (
          <p>No sent emails found.</p>
        )}
      </ul>
    </div>
  );
};

export default SentEmails;
