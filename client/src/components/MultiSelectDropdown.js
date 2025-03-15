import { useState, useEffect, useRef } from "react";
import { HiChevronDown, HiChevronUp, HiX } from "react-icons/hi";

export default function MultiSelectDropdown({ items, selected, setSelected, name }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleSelection = (item) => {
        setSelected((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const removeSelection = (item, event) => {
        event.stopPropagation(); // Prevent toggling the dropdown
        setSelected((prev) => prev.filter((i) => i !== item));
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-72 relative h-[40px]" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                className="bg-white w-full flex items-center justify-between border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-orange-500"
                onClick={() => setIsOpen(!isOpen)}
            >

                <span className="flex-grow overflow-hidden max-w-full">
                    {selected.length > 0 & isOpen ? (
                        <div className="flex gap-2 overflow-x-auto">
                            {selected.map((item) => (
                                <div key={item} className="flex items-center bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                    <span className="mr-1">{item}</span>
                                    <button onClick={(e) => removeSelection(item, e)} className="text-orange-700 hover:text-orange-900">
                                        <HiX size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        name || "Select item"
                    )}
                </span>
                {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <div className="absolute w-72 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {items.map((item) => (
                        <div
                            key={item}
                            className={`flex items-center justify-between px-3 py-2 cursor-pointer ${selected.includes(item) ? "bg-orange-100" : "hover:bg-gray-100"
                                }`}
                            onClick={() => toggleSelection(item)}
                        >
                            <span>{item}</span>
                            {selected.includes(item) && <HiX size={16} className="text-orange-500" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}