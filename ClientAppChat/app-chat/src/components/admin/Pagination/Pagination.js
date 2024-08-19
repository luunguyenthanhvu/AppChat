import React from 'react';
import '../../../css/Pagination.css'; // Adjust the path if needed

function Pagination({ currentPage, totalPages, onPageChange, customStyles = {} }) {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={number === currentPage ? 'active' : ''}
                    style={{
                        backgroundColor: number === currentPage ? customStyles.activeBgColor : customStyles.bgColor,
                        borderColor: customStyles.borderColor,
                        color: customStyles.textColor,
                    }}
                >
                    {number}
                </button>
            ))}
        </div>
    );
}

export default Pagination;
