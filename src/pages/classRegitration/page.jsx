import React, { useState } from 'react';

const ScheduleRegistration = () => {
    const [classes] = useState([
        {
            id: 1,
            name: 'Nhập môn lập trình',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
        {
            id: 2,
            name: 'Tin học văn phòng',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
        {
            id: 3,
            name: 'JavaScript cơ bản',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
        {
            id: 4,
            name: 'JavaScript nâng cao',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
        {
            id: 5,
            name: 'Java 1',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
        {
            id: 6,
            name: 'Tin học cơ sở',
            slots: [
                { id: 1, slotTime: 'Ca 1', available: true, currentStudents: 20 },
                { id: 2, slotTime: 'Ca 2', available: false, currentStudents: 40 },
                { id: 3, slotTime: 'Ca 3', available: true, currentStudents: 15 },
                { id: 4, slotTime: 'Ca 4', available: true, currentStudents: 15 },
                { id: 5, slotTime: 'Ca 5', available: true, currentStudents: 15 },
                { id: 6, slotTime: 'Ca 6', available: false, currentStudents: 15 },
            ],
        },
    ]);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleJoin = (slotId) => {
        const selectedClass = classes.find((cls) =>
            cls.slots.some((slot) => slot.id === slotId)
        );
        const slot = selectedClass.slots.find((s) => s.id === slotId);
        if (slot.available) {
            setSelectedSlot(slotId);
            setShowConfirmation(true);
        }
    };

    const confirmJoin = () => {
        // Thực hiện hành động đăng ký ở đây (gửi request đến API, v.v.)
        alert(`Đã tham gia lớp với Slot ID: ${selectedSlot}`);
        setShowConfirmation(false);
        setSelectedSlot(null);
    };

    const cancelJoin = () => {
        setShowConfirmation(false);
        setSelectedSlot(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4 bg-white sticky top-0 z-10 p-4">Đăng ký lịch học</h1>
            <div className="grid grid-cols-2 gap-4">
                {classes.map((cls) => (
                    <div key={cls.id} className="p-4 border rounded-lg bg-gray-100">
                        <h2 className="font-bold">{cls.name}</h2>
                        <h3 className="font-semibold">{cls.time}</h3>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {cls.slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    className={`p-2 rounded ${slot.available ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-300 cursor-not-allowed'}`}
                                    disabled={!slot.available}
                                    onClick={() => handleJoin(slot.id)}
                                >
                                    {slot.slotTime} - {slot.currentStudents} / 40 học sinh
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="font-bold mb-2">Xác nhận tham gia lớp</h2>
                        <p>
                            Bạn có chắc chắn muốn tham gia lớp với Slot ID: {selectedSlot} không?
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button className="mr-2 p-2 bg-blue-500 text-white rounded" onClick={confirmJoin}>
                                Xác nhận
                            </button>
                            <button className="p-2 bg-gray-300 rounded" onClick={cancelJoin}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleRegistration;
