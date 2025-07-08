//TODO: frontend/src/utils/index.js

/**
 * Formats a price to Mexican peso currency
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

/**
 * Formats a date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a date to a short string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString("es-MX");
};

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates a password (minimum 8 characters, at least one letter and one number)
 * @param {string} password - The password to validate
 * @returns {boolean} True if valid password
 */
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

/**
 * Generates a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Converts file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates file type and size
 * @param {File} file - The file to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} Validation result
 */
export const validateFile = (
  file,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 5 * 1024 * 1024
) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push("Tipo de archivo no permitido");
  }

  if (file.size > maxSize) {
    errors.push(
      `El archivo es demasiado grande. Máximo ${Math.round(
        maxSize / 1024 / 1024
      )}MB`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Formats file size to human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Creates a slug from a string
 * @param {string} str - The string to convert
 * @returns {string} Slug string
 */
export const createSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Gets the initials from a name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials
 */
export const getInitials = (firstName = "", lastName = "") => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Calculates reading time for text
 * @param {string} text - The text to analyze
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Checks if user is on mobile device
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Scrolls to element smoothly
 * @param {string} elementId - ID of the element to scroll to
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Not Copied", error);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * Downloads a file from URL
 * @param {string} url - File URL
 * @param {string} filename - Desired filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Gets query parameters from URL
 * @returns {Object} Query parameters object
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Sets query parameters in URL
 * @param {Object} params - Parameters to set
 */
export const setQueryParams = (params) => {
  const url = new URL(window.location);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, "", url);
};
