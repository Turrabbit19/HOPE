import { Button, Modal, message as antdMessage } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../config/axios";
import Echo from "laravel-echo";
import { io } from "socket.io-client";

const ConfirmChangeSchedule = () => {
  const userId = localStorage.getItem("user_id");
  const [waitCount, setWaitCount] = useState(null);
  const [queuePosition, setQueuePosition] = useState(null);
  const [neededCount, setNeededCount] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "socket.io",
      client: io,
      host: "http://localhost:6001",
      debug: true
    });
    console.log(echo);
    echo.connector.socket.on('connect', () => {
      console.log("Connected to Laravel Echo Server!");
    });
    echo.connector.socket.on('disconnect', () => {
      console.log("Disconnected from Laravel Echo Server!");
    });
    echo.channel("queue").listen("queueUpdated", (data) => {
      console.log(data);
      const { userId: eventUserId, waitCount, status } = data;

      if (eventUserId === userId) {
        if (status === "updated") {
          setWaitCount(waitCount);
          setQueuePosition(waitCount);
          setNeededCount(waitCount > 2 ? waitCount - 2 : 0);

          if (waitCount === -1) {
            localStorage.setItem("in_queue", "true");
            antdMessage.success("Đến lượt bạn! Chuyển sang trang xử lý...");
            navigate("/student/class-registration");
          }
        } else if (status === "removed") {
          setWaitCount(null);
          setQueuePosition(null);
          setNeededCount(null);
          antdMessage.info("Bạn đã bị xóa khỏi hàng đợi.");
        }
      }
    });

    return () => {
      echo.disconnect();
    };
  }, [userId, navigate]);

  const handleJoinQueue = async () => {
    try {
      const response = await instance.post("student/queue/add", { user_id: userId });
      const { wait_count } = response.data;

      setWaitCount(wait_count);
      setQueuePosition(wait_count + 2);
      setNeededCount(wait_count);

      if (wait_count === -1) {
        localStorage.setItem("in_queue", "true");
        antdMessage.success("Bạn đã đến lượt!");
        navigate("/student/class-registration");
      } else {
        antdMessage.info(`Bạn đang chờ ${wait_count} lượt.`);
        setIsModalVisible(true);
      }
    } catch (error) {
      antdMessage.error("Lỗi khi tham gia hàng đợi. Vui lòng thử lại.");
    }
  };

  const handleDeleteQueue = async () => {
    try {
      await instance.post("student/queue/finish", { user_id: userId });
      antdMessage.success("Bạn đã xóa khỏi hàng đợi.");
      setWaitCount(null);
      setQueuePosition(null);
      setNeededCount(null);
      localStorage.setItem("in_queue", "false");
    } catch (error) {
      antdMessage.error("Lỗi khi xóa khỏi hàng đợi. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <nav className="space-y-2">
        <Button type="primary" onClick={handleJoinQueue}>
          Xác nhận đổi lịch học
        </Button>
      </nav>

      <div>
        <h1>Trạng thái Hàng Đợi</h1>
        <p>{waitCount !== null ? `Bạn đang chờ ${waitCount} lượt.` : "Chưa tham gia hàng đợi."}</p>
        {queuePosition !== null && <p>Vị trí hiện tại: {queuePosition}</p>}
      </div>

      <Button danger onClick={handleDeleteQueue}>
        Xóa khỏi hàng đợi
      </Button>

      <Modal
        title="Thông tin Hàng Đợi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <p>Vị trí hiện tại của bạn trong hàng đợi: {queuePosition}</p>
        <p>Số người cần chờ trước khi đến lượt: {neededCount}</p>
      </Modal>
    </div>
  );
};

export default ConfirmChangeSchedule;
