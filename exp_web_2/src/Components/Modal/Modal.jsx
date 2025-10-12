import React from 'react';
import { X } from 'lucide-react';

// Generic Modal Component
const Modal = ({ isOpen, onClose, children }) => {
if (!isOpen) return null;

return (
    <div 
    className="modal-overlay"
    onClick={onClose} 
    >
    <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
    >
        <button
        onClick={onClose}
        className="modal-close-btn"
        >
        <X className="w-5 h-5" />
        </button>
        
        {children}
    </div>
    </div>
);
};

export default Modal;