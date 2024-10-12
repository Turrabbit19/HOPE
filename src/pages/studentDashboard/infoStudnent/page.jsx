import { Eye, Pencil } from 'lucide-react'

export default function InfoStudent() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg ">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column - Student Information */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="Pham Quoc Khanh"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Pham Quoc Khanh</h2>
                <span className="text-green-500 text-sm">• Active</span>
              </div>
              <p className="text-blue-600">PH38668</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Ngày sinh', value: '11/02/2004' },
              { label: 'Giới tính', value: 'Nam' },
              { label: 'Email', value: 'khanhpqph38668@fpt.edu.vn' },
              { label: 'Số điện thoại', value: '0334675867' },
              { label: 'Địa chỉ', value: '54 Mỹ Đình 2, Hà Nội' },
              { label: 'Dân tộc', value: 'Kinh' },
              { label: 'Trạng thái', value: 'Đang học' },
            ].map((item, index) => (
              <div key={index} className="flex">
                <span className="w-1/3 text-gray-600">{item.label}</span>
                <span className="w-2/3">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Parents Information */}
        <div className="w-full md:w-1/2">
          <div className="flex gap-4 mb-6 border-b">
            <button className="text-blue-600 font-medium pb-2 border-b-2 border-blue-600">
              <Eye className="w-4 h-4 inline mr-1" />
              Phụ huynh
            </button>
            <button className="text-gray-500 font-medium pb-2">
              <Pencil className="w-4 h-4 inline mr-1" />
              Chỉnh sửa thông tin cá nhân
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-4">Parents Information</h3>
          <div className="space-y-6">
            {[
              {
                name: 'Jerald Vicinius',
                role: 'Father',
                phone: '+1 45545 46464',
                email: '[email protected]',
                image: '/placeholder.svg?height=50&width=50',
              },
              {
                name: 'Roberta Webber',
                role: 'Mother',
                phone: '+1 46499 24357',
                email: '[email protected]',
                image: '/placeholder.svg?height=50&width=50',
              },
            ].map((parent, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={parent.image}
                  alt={parent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{parent.name}</h4>
                      <p className="text-blue-600 text-sm">{parent.role}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex">
                      <span className="w-1/4 text-gray-600 text-sm">Phone</span>
                      <span className="w-3/4 text-sm">{parent.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/4 text-gray-600 text-sm">Email</span>
                      <span className="w-3/4 text-sm">{parent.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}