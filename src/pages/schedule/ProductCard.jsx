// ProductCard.jsx
import React from 'react';

const ProductCard = ({ day, additionalInfo  }) => {
    const colorMap = {
        Monday: 'bg-red-100',
        Tuesday: 'bg-blue-100',
        Wednesday: 'bg-green-100',
        Thursday: 'bg-yellow-100',
        Friday: 'bg-purple-100',
        Saturday: 'bg-indigo-100',
    };

    return (
        
        <div className={`p-2 rounded ${colorMap[day]}`}>
            <p className="text-xs">09:00 - 09:45 AM</p>
            <p className="text-sm font-semibold">Subject: Maths</p>
            <p className="text-sm">Class: 10A</p>
            <p className="text-sm">Room: 101</p>
            <p className="text-sm">Session: 2</p>
            <div className="flex items-center mt-2">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <img className="aspect-square h-full w-full" alt="User" src="/placeholder-user.jpg" />
                </span>
                <span className="ml-2 text-xs">Instructor Name</span>
            </div>
        </div>
    );
};

export default ProductCard;
