import { Button, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const List = () => {
  const columns = [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Column 1",
      dataIndex: "address",
      key: "1",
    },
    {
      title: "Column 2",
      dataIndex: "address",
      key: "2",
    },
    {
      title: "Column 3",
      dataIndex: "address",
      key: "3",
    },
    {
      title: "Column 4",
      dataIndex: "address",
      key: "4",
    },
    {
      title: "Column 5",
      dataIndex: "address",
      key: "5",
    },
    {
      title: "Column 6",
      dataIndex: "address",
      key: "6",
    },
    {
      title: "Column 7",
      dataIndex: "address",
      key: "7",
    },
    {
      title: "Column 8",
      dataIndex: "address",
      key: "8",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 170,
      render: () => (
        <div className="flex gap-1">
          <Button danger>Xóa</Button>
          <Link><Button>Cập nhật</Button></Link>
        </div>
      )
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "3",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "4",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "5",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "6",
      name: "John Brown",
      age: 32,
      address: "New York Park",
    },
    {
      key: "7",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "8",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "9",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "10",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
    {
      key: "11",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
  ];
  return (
    <>
      {/* <h1>Học sinh</h1> */}
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1300,
        }}
      />
    </>
  );
};

export default List;
