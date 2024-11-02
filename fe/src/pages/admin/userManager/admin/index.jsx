import { Avatar, Button, Descriptions, Divider, Input, message, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";
import { add } from "date-fns";

import {
  DeleteOutlined,
  UserOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { createUser, deleteUser, getUser } from "../../../../services/user-service";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver'
const AdminManager = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const fileInputRef = useRef(null); 
  
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [recordType, setRecordType] = useState("");
  const [reload, setReload] = useState(false);

  const [dataImport, setDataImport] = useState([])

  const [textSearch, setTextSearch] = useState('');

  const [panigation, setPanigation] = useState({
    current_page: 1
  })

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get("admin/officers");
        let dataConcac = data.Admin.data
        dataConcac.concat(data.Officers.data)
        console.log(dataConcac);
        
        setAdmins([...data.Admin.data, ...data.Officers.data])
        // setLoading();
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  useEffect(() => {
    if(dataImport.length > 0){
      handleAddAdmin()
    }
  }, [dataImport])

  console.log(dataImport);

  async function handleAddAdmin(){
    let textError = 'Dữ liệu các hàng trên đã được thêm, Xảy ra lỗi ở dòng'
    setLoading(true);
    
    
    for (let i = 0; i < dataImport.length; i++){
      console.log(dataImport[i]?.role);
      
      let body = {...dataImport[i], avatar: null, role_id: dataImport[i]?.role === 'Cán bộ' ? 2 : 1, password: 'admin@2024'}
      
      try {
        // Chờ cho createStudent hoàn tất trước khi tiếp tục
        await createUser(body);
        console.log(`Admin ${i + 1} created successfully.`);
      } catch (error) {
        // setLoading(false)
        textError = textError + ' '  +(i + 1)
        message.error(textError)
        setReload(!reload)     
        // message.error('Đã xãy ra lỗi vui lòng kiểm tra lại dữ liệu')
        return
      }
    }
    message.success('Dữ liệu đã được import vào.')
    setReload(!reload)
   
  }



  if (loading) {
    return <Loading />;
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: 12,
      width: 70
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar) => (
        <Avatar
          src={`https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${avatar}` || <UserOutlined />}
          icon={!avatar && <UserOutlined />} />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: 200,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      key: "1",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
      key: "2",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 170,
      render: (_, record) => (


        <div className="flex flex-row items-center justify-between">
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() =>
              handleDetailClick(
                record
              )
            }
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`${`/admin/list-users/edit/${record.id}`}`, {
              state: {
                type: 'admins'
              }
            })}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => {
              console.log("Dô đây");
              handleDelete(record)
            }} // Xóa tài khoản
            okText="Có"
            cancelText="Không"
          >
            <Button  type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>

      ),
    },
  ];
  const data = admins.map((item, index) => {
    return {
      key: item.id,
      id: item.id,
      stt: index + 1,
      fullname: item.name,
      email: item.email,
      phone: item.phone,
      avatar: item.avatar
    };
  });

  const handleDetailClick = (record, type) => {
    setSelectedRecord(record);

    setIsModalVisible(true);
    getUser(record.id).then((res) => {
      setUserDetail(res.data.data);
    });
  };


  const handleDelete = async (record) => {
    console.log(record, "dô đây kh");
    
    await deleteUser(record.id);
    setReload(!reload);
    message.success(`Đã xóa tài khoản: ${record.name}`);
  };

  const handleAdd = () => {
    navigate(`/admin/list-users/add`, {
      state: {
        type: 'admin'
      }
    })
  }

  let dataSearch = data.filter((e) => {
    let fullname = e?.fullname || ''

    if (textSearch === '') {
      return true
    }

    return fullname.search(textSearch) > -1

  })
  


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      const reader = new FileReader();
   
      reader.onload = (evt) => {
       
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        // Lấy dữ liệu từ sheet đầu tiên
        const firstSheet = workbook.Sheets[workbook.SheetNames[2]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        // setData(jsonData);
        setDataImport(jsonData)
        
      };
      reader.readAsBinaryString(file);
    }
  };
  
  function handlePickExcel(){
    fileInputRef.current.click();
  }

  const handleExport = () => {
   
    let dataExport =  data.map(({ key, id, ...rest }) => rest);
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataExport);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FlowData');

    // Generate a binary string and create a Blob
    const workbookBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookBlob], { type: 'application/octet-stream' });

    // Use FileSaver to save the file
    saveAs(blob, 'admin.xlsx');
};

  return (
    <>
      <div>
        <div className="flex justify-between mb-2">
          <h1>Quản trị viên</h1>
          <div className="flex flex-row">
          <Button onClick={handleAdd}>Thêm quản trị viên</Button>
          <input type="file" accept=".xlsx, .xls"  ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}}/>
          <Button onClick={handlePickExcel} className="ml-5" type="primary">Import</Button>
          <Button onClick={handleExport} className="ml-5" type="default">Export</Button>
          </div>
        </div>
        <div className="relative">
          <Input
            value={textSearch}
            allowClear={true}
            onChange={(e) => {
              setTextSearch(e.target.value)
              // if (panigation.page !== 1) {
              //   setPanigation((pre) => ({
              //     ...pre,
              //     current_page: 1
              //   }))
              // }
            }}
            onClear={() => setTextSearch('')}
            placeholder="Tìm kiếm theo mã hoặc tên quản trị viên ...."
            className="xl:w-[300px] md:w-[180px] max-[767px]:w-[120px]"
          />
        </div>
      </div>

      <Divider />
      <Table
        columns={columns}
        dataSource={dataSearch.slice(panigation.current_page > 1 ? (panigation.current_page - 1) * 10 : panigation.current_page - 1, panigation.current_page * 10)}
        onChange={(e) => setPanigation((pre) => ({...pre, current_page: e.current}))}
        pagination={{
          total: admins.length,
          pageSize: 10,
          current: panigation.current_page
        }}
      />

      {selectedRecord && (
        <Modal
          title={`Chi tiết ${recordType === "teacher"
              ? "Giảng Viên"
              : recordType === "classManager"
                ? "Quản Trị Viên"
                : "Học Viên"
            }`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800} // Tăng kích thước modal
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Avatar
              size={100}
              src={`https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${userDetail?.avatar}` || <UserOutlined />}
              style={{ marginRight: 20 }}
            />
            <div>
              <h3>{userDetail.name}</h3>
              <p>Email: {userDetail.email}</p>
              <p>Điện Thoại: {userDetail.phone}</p>
            </div>
          </div>
          <Divider />

          <Descriptions bordered column={1}>
            {/* Thông tin cho Quản Trị Viên */}

            {/* Thông tin cho Học Viên */}

            <>
              <Descriptions.Item label="Ngày Sinh">
                {userDetail.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Giới Tính">
                {userDetail.gender ? "Nam" : "Nữ"}
              </Descriptions.Item>
              <Descriptions.Item label="Dân Tộc">
                {userDetail.ethnicity}
              </Descriptions.Item>
              <Descriptions.Item label="Địa Chỉ">
                {userDetail.address}
              </Descriptions.Item>
            </>

          </Descriptions>
        </Modal>
      )}
    </>
  );
};

export default AdminManager;
