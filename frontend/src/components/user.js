// user.js

// Set user to localStorage
export const setUser = (username) => {
    localStorage.setItem('user', username);
    localStorage.setItem('userTimestamp', new Date().getTime()); // Store the current timestamp in milliseconds
};


// Get user from localStorage
export const getUser = () => {
    return localStorage.getItem('user');
};
