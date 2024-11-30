import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import instance from "../../../config/axios";
import { notification } from "antd";

const MailManagement = () => {
  const style = { layout: "vertical" };
  const [amount, setAmount] = useState(10.00)
  const createOrder = async (data, actions) => {
    try {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount,
            },
          },
        ],
      });
    } catch (err) {
      console.log("Error creating order:", err.message);
      throw new Error("Error creating PayPal order");
    }
  };

  let infor = {
    student_id: 2,
    payment_id: '',
    amount: amount,
  }

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      infor.payment_id = details.id;
      const response = await instance.post(`admin/paypal`, infor)
      notification.success({
        message: "Thanh toán học phí thành công"
      })
    } catch (err) {
      console.error("Error in onApprove:", err.message);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AUxabASNDpkW7wNFNpvbTD7k2FfqUID-BWIEk9qq9FVGpNImUq74PH3oPMQyjMMwqHIauqWB0shiW4Ex",
      }}
    >
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};

export default MailManagement;
