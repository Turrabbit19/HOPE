import { Card, Col, Pagination, Row } from "antd";
import React, { useState } from "react";
import BreadCrumb from "../../../../routes/breadcrumb";

const ListCourse = () => {
    const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const cardData = [
    { title: "Card 1", content: "Card content 1" },
    { title: "Card 2", content: "Card content 2" },
    { title: "Card 3", content: "Card content 3" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    { title: "Card 4", content: "Card content 4" },
    // Add more card data as needed
  ];
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardData.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <Row gutter={16}>
        {currentCards.map((card, index) => (
          <Col
            span={8}
            key={index}
            style={{
              marginTop: index >= 3 ? 16 : 0,
            }}
          >
            <Card
              className="border-black border-[1px]"
              title={card.title}
              bordered={true}
            >
              {card.content}
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        className="mt-4"
        align="center"
        defaultCurrent={1}
        total={cardData.length}
        pageSize={cardsPerPage}
        onChange={handlePageChange}
      />
    </>
  );
};

export default ListCourse;
