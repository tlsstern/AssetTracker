// Swiss number formatting with apostrophes as thousand separators
export const formatSwissNumber = (number) => {
  if (number == null || isNaN(number)) return '0.00';
  
  // Convert to fixed 2 decimal places
  const fixed = parseFloat(number).toFixed(2);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixed.split('.');
  
  // Add apostrophes as thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  return `${formattedInteger}.${decimalPart}`;
};

// Format currency with CHF prefix
export const formatCHF = (number) => {
  return `CHF ${formatSwissNumber(number)}`;
};