import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;

  ${(props) =>
    props.noPagination
      ? `
      display:none;
    `
      : ``}
`;

const PaginationButton = styled(Button)`
  padding: 5px 10px;
  background-color: transparent;

  ${(props) =>
    props.active
      ? `
      border: 1px solid #aaa;
    `
      : ``}
`;

export default function PaginationGrid({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  noPagination = false,
  setCurrentPageGrid,
}) {
  const renderPageButtons = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <PaginationButton
          key={i}
          onClick={() => setCurrentPageGrid(i)}
          disabled={currentPage === i}
          active={currentPage === i}>
          {i}
        </PaginationButton>
      );
    }

    return pageButtons;
  };

  return (
    <PaginationWrapper noPagination={noPagination}>
      <PaginationButton onClick={handlePrevPage} disabled={currentPage === 1}>
        Anterior
      </PaginationButton>
      {renderPageButtons()}
      <PaginationButton
        onClick={handleNextPage}
        disabled={currentPage === totalPages}>
        Siguiente
      </PaginationButton>
    </PaginationWrapper>
  );
}


