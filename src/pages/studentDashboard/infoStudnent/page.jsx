import React from 'react'
import { Eye, Pencil, Phone, Mail, MapPin, Calendar, User, Briefcase } from 'lucide-react'

export default function InfoStudent() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-8 rounded-xl shadow-2xl max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Student Information */}
        <div className="w-full lg:w-3/10 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Pham Quoc Khanh"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Pham Quoc Khanh</h2>
              <p className="text-blue-600 font-semibold mb-2">PH38668</p>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { icon: Calendar, label: 'Ngày sinh', value: '11/02/2004' },
              { icon: User, label: 'Giới tính', value: 'Nam' },
              { icon: Mail, label: 'Email', value: 'khanhpqph38668@fpt.edu.vn' },
              { icon: Phone, label: 'Số điện thoại', value: '0334675867' },
              { icon: MapPin, label: 'Địa chỉ', value: '54 Mỹ Đình 2, Hà Nội' },
              { icon: User, label: 'Dân tộc', value: 'Kinh' },
              { icon: Briefcase, label: 'Trạng thái', value: 'Đang học' },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <item.icon className="w-5 h-5 text-purple-500 mr-3" />
                <span className="w-1/3 text-gray-600 font-medium">{item.label}:</span>
                <span className="w-2/3 text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Parents Information */}
        <div className="w-full lg:w-7/10 bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-8 border-b">
            <button className="text-purple-600 font-medium pb-2 border-b-2 border-purple-600 transition duration-300 hover:text-purple-700">
              <Eye className="w-4 h-4 inline mr-2" />
              Phụ huynh
            </button>
            <button className="text-gray-500 font-medium pb-2 transition duration-300 hover:text-purple-600">
              <Pencil className="w-4 h-4 inline mr-2" />
              Chỉnh sửa thông tin cá nhân
            </button>
          </div>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Parents Information</h3>
          <div className="space-y-8">
            {[
              {
                name: 'Jerald Vicinius',
                role: 'Father',
                phone: '+1 45545 46464',
                email: '[email protected]',
                image: '/placeholder.svg?height=80&width=80',
              },
              {
                name: 'Roberta Webber',
                role: 'Mother',
                phone: '+1 46499 24357',
                email: '[email protected]',
                image: '/placeholder.svg?height=80&width=80',
              },
            ].map((parent, index) => (
              <div key={index} className="flex items-start gap-6 pb-6 border-b last:border-b-0">
                <img
                  src={parent.image}
                  alt={parent.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">{parent.name}</h4>
                      <p className="text-purple-600 text-sm font-medium">{parent.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600 text-sm">{parent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600 text-sm">{parent.email}</span>
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