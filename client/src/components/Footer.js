import React from 'react';

const Footer = () => {
    return (
        <footer className=" bg-black text-white text-center py-3">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;