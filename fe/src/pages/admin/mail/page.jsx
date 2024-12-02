import { Button, Form, Input } from "antd";
import React, { useState } from "react";

const MailManagement = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleSignIn = () => {
  //   setIsAuthenticated(true);
  // };

  // const handleSignOut = () => {
  //   setIsAuthenticated(false);
  // };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Contact Us</h2>
      <Form
        // onFinish={onFinish}
        layout="vertical"
        initialValues={{ name: "", email: "", subject: "", message: "" }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }, { type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: "Please enter the subject!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Please enter your message!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MailManagement;
