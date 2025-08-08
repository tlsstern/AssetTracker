import React, { useState, useRef, useEffect } from 'react';

const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...",
  displayKey = "label",
  valueKey = "value",
  searchKeys = ["label"],
  disabled = false,
  renderOption = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return searchKeys.some(key => {
      const value = option[key];
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  const selectedOption = options.find(opt => opt[valueKey] === value);

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
    setSearchTerm('');
  };

  const dropdownStyle = {
    position: 'relative',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#f8f9fa',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    outline: 'none',
    fontSize: '14px'
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 1050,
    marginTop: 4
  };

  const optionStyle = {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={dropdownStyle} ref={dropdownRef}>
      <div
        style={inputStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption[displayKey] : placeholder}
      </div>
      
      {isOpen && (
        <div style={dropdownMenuStyle}>
          <input
            type="text"
            style={searchInputStyle}
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option[valueKey] || index}
                  style={{
                    ...optionStyle,
                    backgroundColor: option[valueKey] === value ? '#f0f0f0' : 'transparent'
                  }}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = option[valueKey] === value ? '#f0f0f0' : 'transparent'}
                >
                  {renderOption ? renderOption(option) : option[displayKey]}
                </div>
              ))
            ) : (
              <div style={{ padding: '10px 12px', color: '#999' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;