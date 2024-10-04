import React from "react";

const Schedule = () => {
  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <div className="grid grid-cols-8 gap-1 p-4 border-b border-gray-200 text-center font-bold text-gray-700 ">
          <div>Ca học</div>
          <div>Thứ 2</div>
          <div>Thứ 3</div>
          <div>Thứ 4</div>
          <div>Thứ 5</div>
          <div>Thứ 6</div>
          <div>Thứ 7</div>
          <div>Chủ nhật</div>
        </div>
        <div className="block md:hidden p-4">
          <div className="flex flex-col gap-1 p-4">
            <div className="font-bold text-gray-700">Thứ 2</div>
            <div className="font-bold text-gray-700">Thứ 3</div>
            <div className="font-bold text-gray-700">Thứ 4</div>
            <div className="font-bold text-gray-700">Thứ 5</div>
            <div className="font-bold text-gray-700">Thứ 6</div>
            <div className="font-bold text-gray-700">Thứ 7</div>
            <div className="font-bold text-gray-700">Chủ nhật</div>
          </div>
        </div>
      </div>
      <div className="grid-cols-7 gap-1 p-4 flex flex-col ml-7">
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 1
        </div>
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 2
        </div>
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 3
        </div>
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 4
        </div>
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 5
        </div>
        <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
          Ca 6
        </div>
      </div>
    </div>
  );
};

export default Schedule;
