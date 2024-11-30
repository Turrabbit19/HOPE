import { useState, useEffect } from 'react';

export default function TeacherInfo() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu giảng viên');
        }
        const data = await response.json();
        setTeacher(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [token]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!teacher) return <div>Không có dữ liệu giảng viên</div>;

  return (
    <div className="teacher-info bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-2xl mx-auto my-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Thông tin giảng viên</h2>
  <img 
    src={teacher.avatar} 
    alt={teacher.name} 
    className="teacher-avatar w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500" 
  />
  <div className="teacher-details space-y-4">
    <p className="text-gray-700">
      <strong className="text-gray-900">Họ và tên:</strong> {teacher.name}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Mã giảng viên:</strong> {teacher.teacher_code}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Chuyên ngành:</strong> {teacher.major_name}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Email:</strong> {teacher.email}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Số điện thoại:</strong> {teacher.phone}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Ngày sinh:</strong> {teacher.dob}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Giới tính:</strong> {teacher.gender}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Dân tộc:</strong> {teacher.ethnicity}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Địa chỉ:</strong> {teacher.address}
    </p>
    <p className="text-gray-700">
      <strong className="text-gray-900">Trạng thái:</strong> 
      <span className={`ml-2 px-2 py-1 rounded ${
        teacher.status === 'Hoạt động' 
          ? 'bg-green-200 text-green-800' 
          : 'bg-red-200 text-red-800'
      }`}>
        {teacher.status}
      </span>
    </p>
  </div>
</div>

  );
}

