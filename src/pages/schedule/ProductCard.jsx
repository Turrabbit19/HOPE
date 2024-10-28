import React, { useState, useMemo } from 'react';

const ProductCard = ({ day, shift, subject = "Toán học", room = "101", instructor = "Nguyễn Văn A", additionalInfo, isBottomRow }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getRandomPastelColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 80%)`;
    };

    const backgroundColor = useMemo(() => getRandomPastelColor(), []);

    const getDarkerColor = (color) => {
        const [h, s, l] = color.match(/\d+/g).map(Number);
        return `hsl(${h}, ${s}%, ${l - 10}%)`;
    };

    const hoverBackgroundColor = getDarkerColor(backgroundColor);

    return (
        <div 
            className="relative p-4 rounded-lg shadow-sm transition-all duration-300"
            style={{
                backgroundColor: backgroundColor,
                '--hover-bg-color': hoverBackgroundColor
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <p className="text-sm font-semibold">Môn học: {subject}</p>
                <p className="text-sm">Phòng: {room}</p>
                <div className="flex items-center mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                            src="/placeholder-user.jpg" 
                            alt={instructor} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="ml-2 text-xs">{instructor}</span>
                </div>
            </div>

            {isHovered && (
                <div className={`absolute ${isBottomRow ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-64 p-4 bg-white rounded-lg shadow-lg z-10`}>
                    <h3 className="font-semibold text-lg mb-2">Thông tin chi tiết</h3>
                    <p className="text-sm">Ngày: {day}</p>
                    <p className="text-sm">Ca: {shift}</p>
                    {additionalInfo?.time && <p className="text-sm">Thời gian: {additionalInfo.time}</p>}
                    {additionalInfo?.class && <p className="text-sm">Lớp: {additionalInfo.class}</p>}
                    {additionalInfo?.session && <p className="text-sm">Buổi: {additionalInfo.session}</p>}
                    <p className="text-sm">Môn học: {subject}</p>
                    <p className="text-sm">Phòng: {room}</p>
                    <p className="text-sm">Giảng viên: {instructor}</p>
                </div>
            )}
            <style jsx>{`
                div:hover {
                    background-color: var(--hover-bg-color);
                }
            `}</style>
        </div>
    );
};

export default ProductCard;