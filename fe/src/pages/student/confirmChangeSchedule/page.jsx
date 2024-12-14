import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../config/axios"; // Giả sử bạn có instance axios đã cấu hình
import echo from "../../../config/echo";

const ConfirmChangeSchedule = () => {
  const user_id = localStorage.getItem("user_id");
  const [waitCount, setWaitCount] = useState(null);
  const [message, setMessage] = useState("Nhấn nút để tham gia hàng đợi.");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);  // Vị trí trong hàng đợi
  const [neededCount, setNeededCount] = useState(null);  // Số người cần chờ trước khi đến lượt
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleJoinQueue = async () => {
    try {
      const response = await instance.post("student/queue/add", {
        user_id: userId,
      });
      const { wait_count } = response.data;
      console.log(wait_count);
      setWaitCount(wait_count);

      if (wait_count <= 2) {
        navigate("/student/class-registration");
      } else {
        setMessage(`Bạn đang chờ ${wait_count} lượt.`);
        setQueuePosition(wait_count);  // Cập nhật vị trí trong hàng đợi
        setNeededCount(wait_count > 2 ? wait_count - 2 : 0);  // Cập nhật số người cần chờ
        setIsModalVisible(true);  // Mở modal
      }
    } catch (error) {
      setMessage("Lỗi khi tham gia hàng đợi. Vui lòng thử lại.");
    }
  };

  const handleDeleteQueue = async () => {
    try {
      await instance.post("student/queue/finish", {
        user_id: userId,
      });
      setMessage("Đã hủy tham gia hàng đợi.");
      setWaitCount(null);
    } catch (error) {
      setMessage("Lỗi khi tham gia hàng đợi. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    debugger
    // if (waitCount === null || waitCount <= 2) return;

    const channel = echo.channel("queue");

    const handleQueueUpdate = (data) => {
      console.log("Received data from Pusher:", data);

      if (data.userId === userId) {
        if (data.waitCount === 0) {
          setMessage("Đến lượt bạn! Chuyển sang trang xử lý...");
          navigate("/student/class-registration");
        } else {
          setWaitCount(data.waitCount);
          setMessage(`Bạn đang chờ ${data.waitCount} lượt.`);
          
          setQueuePosition(data.waitCount);
          setNeededCount(data.waitCount > 2 ? data.waitCount - 2 : 0);
        }
      }
    };

    channel.listen("QueueUpdated", handleQueueUpdate);

    return () => {
      echo.leaveChannel("queue");
    };
  }, [waitCount, userId, navigate]);

  return (
    <>
      <nav className="space-y-2">
        <Button onClick={handleJoinQueue}>Xác nhận đổi lịch học</Button>
      </nav>
      <div>
        <h1>Trạng thái Hàng Đợi</h1>
        <p>{message}</p>
        {waitCount !== null && waitCount > 0 && (
          <p>Lượt chờ hiện tại: {waitCount}</p>
        )}
      </div>
      <Button onClick={handleDeleteQueue}>Xóa</Button>

      {/* Modal hiển thị vị trí hàng đợi và số người cần chờ */}
      <Modal
        title="Thông tin Hàng Đợi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p>Vị trí hiện tại của bạn trong hàng đợi: {queuePosition}</p>
        <p>Số người còn lại trước khi đến lượt bạn: {neededCount}</p>
        <Button
          onClick={() => setIsModalVisible(false)}
          type="primary"
          block
        >
          Đóng
        </Button>
      </Modal>
    </>
  );
};

export default ConfirmChangeSchedule;
