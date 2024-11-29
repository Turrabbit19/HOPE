import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const MailManagement = () => {
  const style = {"layout":"vertical"};
  const createOrder = async (data, actions) => {
    try{
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "10.00",
            },
          },
        ],
      });

    }catch(err){
      console.log(err.message);
    }
  }
  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log("Transaction completed by:", details);

      alert("Payment successful!");
    } catch (err) {
      console.error("Error in onApprove:", err.message);
    }
  };
  return (
    <PayPalScriptProvider options={{ clientId: "AUxabASNDpkW7wNFNpvbTD7k2FfqUID-BWIEk9qq9FVGpNImUq74PH3oPMQyjMMwqHIauqWB0shiW4Ex" }}>
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
