import React from 'react'

const Footer = ({ date }) => {
    return (
        <footer className="site-footer">
            <p>Last update: {new Date(date).toLocaleString()}</p>
            <p>created by <a href="https://github.com/silvinomar" target="_blank" rel="noopener noreferrer">silvinomar</a></p>
        </footer>
    );
};

export default Footer;