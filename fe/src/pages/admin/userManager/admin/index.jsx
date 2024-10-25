import { Avatar, Button, Descriptions, Divider, Input, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
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
import { deleteUser, getUser } from "../../../../services/user-service";

const AdminManager = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);

  console.log(admins);
  
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [recordType, setRecordType] = useState("");
  const [reload, setReload] = useState(false);

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
  


  return (
    <>
      <div>
        <div className="flex justify-between mb-2">
          <h1>Quản trị viên</h1>
          <Button onClick={handleAdd}>Thêm quản trị viên</Button>
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
