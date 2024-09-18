// components/events/admindashboard/Pagination.js
const Pagination = ({ eventsPerPage, totalEvents, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav className="pagination">
        <ul className="pagination-list">
          {pageNumbers.map(number => (
            <li key={number} className="pagination-item">
              <a
                onClick={() => paginate(number)}
                href="#"
                className={`pagination-link ${number === currentPage ? 'active' : ''}`}
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default Pagination;
  
