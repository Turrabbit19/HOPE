export default function TestNew() {
  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header Controls */}
      <div className="flex gap-4 mb-8">
        <select className="border border-gray-200 rounded-md px-3 py-2.5 w-[240px] text-gray-700 bg-white focus:outline-none focus:border-blue-500">
          <option>Tất cả khu</option>
        </select>
        <input 
          type="date" 
          defaultValue="2024-10-22"
          className="border border-gray-200 rounded-md px-3 py-2.5 text-gray-700 bg-white focus:outline-none focus:border-blue-500"
        />
        <input 
          type="text"
          placeholder="Tên đăng nhập của giảng viên"
          className="border border-gray-200 rounded-md px-3 py-2.5 flex-1 text-gray-700 bg-white focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-500 text-white px-8 py-2.5 rounded-md font-medium hover:bg-blue-600 transition-colors">
          Lọc dữ liệu
        </button>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse bg-white">
          {/* Time Slots Header */}
          <thead>
            <tr className="text-center bg-gray-50 border-b border-gray-200">
              <th className="border-r border-gray-200 p-3 font-medium text-gray-700">Phòng</th>
              {[
                { slot: "Ca 0", time: "00:00 - 23:59" },
                { slot: "Ca 1", time: "07:15 - 09:15" },
                { slot: "Ca 2", time: "09:25 - 11:25" },
                { slot: "Ca 3", time: "12:00 - 14:00" },
                { slot: "Ca 4", time: "14:10 - 16:10" },
                { slot: "Ca 5", time: "16:20 - 18:20" },
                { slot: "Ca 6", time: "18:30 - 20:30" },
                { slot: "Ca 7", time: "20:30 - 22:30" },
                { slot: "Ca 8", time: "20:30 - 22:30" }
              ].map((period, i) => (
                <th key={i} className="border-r border-gray-200 p-3 font-medium text-gray-700 last:border-r-0">
                  <div>{period.slot}</div>
                  <div className=" font-normal text-gray-500">{period.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                room: 'F101',
                slots: [
                  null,
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'PR19301',
                    teacher: 'anhltd5',
                    code: 'PRE206'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'PR19302',
                    teacher: 'minhdb6',
                    code: 'PRE206'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'PR18401',
                    teacher: 'phuongtt92',
                    code: 'PRE209'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'MS19201',
                    teacher: 'trangtt229',
                    code: 'MAR2061'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19303',
                    teacher: 'hiennq6',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19304',
                    teacher: 'kientt48',
                    code: 'DOM201'
                  },
                  null,
                  {
                    type: 'Remote',
                    class: 'PRO2043.Hanghn2',
                    teacher: 'hanghn2',
                    code: 'PRO2043'
                  }
                ]
              },
              {
                room: 'F102',
                slots: [
                  null,
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19307',
                    teacher: 'viethq23',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19206',
                    teacher: 'sonnt154',
                    code: 'MAR207'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19311',
                    teacher: 'viethq23',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'PR18402',
                    teacher: 'phuongtt92',
                    code: 'PRE209'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19315',
                    teacher: 'ducnh63',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19316',
                    teacher: 'ducnh63',
                    code: 'DOM201'
                  },
                  null,
                  {
                    type: 'Remote',
                    class: 'PRO2043.Dungltt22',
                    teacher: 'dungltt22',
                    code: 'PRO2043'
                  }
                ]
              },
              {
                room: 'F103',
                slots: [
                  null,
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19319',
                    teacher: 'huyenltp',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19308',
                    teacher: 'viethq23',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19323',
                    teacher: 'quantd10',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19312',
                    teacher: 'ducnh63',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19327',
                    teacher: 'khoatm3',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19328',
                    teacher: 'khoatm3',
                    code: 'DOM201'
                  },
                  null,
                  {
                    type: 'Remote',
                    class: 'PRO2043.Trangnt229',
                    teacher: 'trangnt229',
                    code: 'PRO2043'
                  }
                ]
              },
              {
                room: 'F201',
                slots: [
                  null,
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19331',
                    teacher: 'thanhdd37',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19320',
                    teacher: 'huyenltp',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19335',
                    teacher: 'ducnh63',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19324',
                    teacher: 'quantd10',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19339',
                    teacher: 'trungnd57',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19340',
                    teacher: 'trungnd57',
                    code: 'DOM201'
                  },
                  null,
                  {
                    type: 'Remote',
                    class: 'PRO2043.Phucnt57',
                    teacher: 'phucnt57',
                    code: 'PRO2043'
                  }
                ]
              },
              {
                room: 'F202',
                slots: [
                  null,
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19343',
                    teacher: 'thanhpt28',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19332',
                    teacher: 'thanhdd37',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19347',
                    teacher: 'huyenltp',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM19336',
                    teacher: 'trungnd57',
                    code: 'DOM201'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM20103',
                    teacher: 'hungtv64',
                    code: 'DOM1071'
                  },
                  {
                    type: 'Bảo vệ/Dự án',
                    class: 'DM20104',
                    teacher: 'hungtv64',
                    code: 'DOM1071'
                  },
                  null,
                  {
                    type: 'Remote',
                    class: 'PRO2043.Chidvk',
                    teacher: 'chidvk',
                    code: 'PRO2043'
                  }
                ]
              }
            ].map((row, i) => (
              <tr key={row.room} className={`text-center ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="border-r border-gray-200 p-3 font-medium text-gray-700">{row.room}</td>
                {row.slots.map((slot, j) => (
                  <td key={j} className="border-r border-gray-200 p-3 last:border-r-0">
                    {slot && (
                      <div className=" space-y-0.5">
                        <div className="font-medium text-gray-900">{slot.type}</div>
                        <div className="text-gray-900">{slot.class}</div>
                        <div className="text-gray-600">{slot.teacher}</div>
                        <div className="text-gray-500">{slot.code}</div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

