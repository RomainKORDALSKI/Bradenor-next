import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import Searchbis from '@/app/components/header/NavNearby';
import { FiCalendar, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import EventCalendar from '@/app/components/header/EventCalendar';
import Bookmark from '@/app/components/header/Bookmark';

Modal.setAppElement('#__next');

const Search = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [modalClass, setModalClass] = useState('');
  const calendarButtonRef = useRef(null);
  const locationButtonRef = useRef(null);
  const bookmarkButtonRef = useRef(null);

  const openModal = (content, buttonRef, modalClass) => {
    if (activeButton === buttonRef.current) {
      closeModal();
    } else {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setModalContent(content);
      setModalClass(modalClass);
      setModalIsOpen(true);
      setActiveButton(buttonRef.current);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    setActiveButton(null);
    setModalClass('');
  };

  const [modalStyle, setModalStyle] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (activeButton) {
        const rect = activeButton.getBoundingClientRect();
        setModalStyle({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeButton]);

  return (
    <div>
      <div className="menu">
        <button
          ref={calendarButtonRef}
          className="menu__button cta-button"
          onClick={() => openModal(<EventCalendar closeModal={closeModal} />, calendarButtonRef, 'event-calendar-modal')}
        >
          <FiCalendar /> <span>Recherche par Date</span> {activeButton === calendarButtonRef.current ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <button
          ref={locationButtonRef}
          className="menu__button cta-button"
          onClick={() => openModal(<Searchbis closeModal={closeModal} />, locationButtonRef, 'search-nearby-modal')}
        >
          <FiMapPin /> <span>Recherche par Localisation/Ville</span> {activeButton === locationButtonRef.current ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <button
          ref={bookmarkButtonRef}
          className="menu__button cta-button"
          onClick={() => openModal(<Bookmark closeModal={closeModal} />, bookmarkButtonRef, 'bookmark-modal')}
        >
          <FaHeart /> <span>Favoris</span> {activeButton === bookmarkButtonRef.current ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className={`modal ${modalClass}`}
        overlayClassName="overlay"
        style={{ content: modalStyle }}
      >
        {modalContent}
      </Modal>
    </div>
    
  );
};

export default Search;












