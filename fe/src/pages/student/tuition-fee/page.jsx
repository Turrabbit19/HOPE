import React, { useEffect, useState } from "react";
import { notification, Spin } from "antd";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import instance from "../../../config/axios";

const TuitionPaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feeData, setFeeData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);

  const fetchFeeData = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance.get(
        "http://127.0.0.1:8000/api/student/getFeeBySemester"
      );
      if (typeof data === "object" && data !== null) {
        setFeeData(data);
      } else {
        setErrorMessage(data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMessage(
          "Đã kết thúc ngày nộp học phí. Nếu chưa nộp vui lòng liên hệ phòng hỗ trợ Sinh Viên"
        );
      } else if (error.response?.status === 405) {
        setErrorMessage("Thời gian nộp học phí chưa bắt đầu.");
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (data, actions) => {
    const amountInUSD = feeData.price / exchangeRate;
    try {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amountInUSD.toFixed(2),
            },
          },
        ],
      });
    } catch (err) {
      console.error("Error creating order:", err.message);
      throw new Error("Error creating PayPal order");
    }
  };

  // Handle approval of the PayPal transaction
  const onApprove = async (data, actions) => {
    const studentId = localStorage.getItem("user_id");
    const infor = {
      user_id: studentId,
      payment_id: "",
      amount: feeData.price,
      currency: "VND",
      semester: feeData.order,
    };

    try {
      const details = await actions.order.capture();
      infor.payment_id = details.id;

      // Sending transaction details to the server
      const response = await instance.post(`student/paypal`, infor);
      notification.success({
        message: "Thanh toán học phí thành công",
      });
      setFeeData(null); // Clear fee data after successful payment
    } catch (err) {
      console.error("Error in onApprove:", err.message);
    }
  };

  // Effect to fetch fee data on load
  useEffect(() => {
    fetchFeeData();
  }, []);

  // If data is loading, show loading spinner
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" tip="Đang tải dữ liệu học phí..." />
      </div>
    );
  }

  // If there is an error, show error message
  if (errorMessage) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="tuition-page p-5 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Thông tin học phí
      </h2>
      {feeData ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="mb-2">
            <strong className="text-gray-700">Kỳ học:</strong> {feeData.order}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Học phí:</strong>{" "}
            <span className="text-green-600 font-semibold">
              {feeData.price.toLocaleString("vi-VN")} VND
            </span>
          </p>

          {/* PayPal button */}
          <div
            id="paypal-button-container"
            className="mt-4 flex justify-center items-center"
          >
            <PayPalScriptProvider
              options={{
                clientId:
                  "AUxabASNDpkW7wNFNpvbTD7k2FfqUID-BWIEk9qq9FVGpNImUq74PH3oPMQyjMMwqHIauqWB0shiW4Ex",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  notification.error({
                    message: "Thanh toán thất bại",
                    description: err.message,
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Không có dữ liệu học phí</p>
      )}
    </div>
  );
};

export default TuitionPaymentPage;
