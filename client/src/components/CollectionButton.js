import React, { useState, useEffect } from "react";
import { useAxios } from "../axios/axios";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import CollectionForm from "./CollectionForm";

const CollectionButton = ({ userId, newsId, isSaved, onSaveChange, theme }) => {
  const [saved, setSaved] = useState(isSaved);
  const [showModal, setShowModal] = useState(false);
  const { privateAxios } = useAxios();

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleSave = async (collectionId) => {
    try {
      if (!collectionId) return;

      await privateAxios.post(`/collection/${collectionId}/add`, { news_id: newsId });
      setSaved(true);
      onSaveChange?.(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving to collection:", error);
    }
  };

  const handleRemove = async (collectionId) => {
    try {
      await privateAxios.delete(`/collection/${collectionId}/remove/${newsId}`);
      setSaved(false);
      onSaveChange?.(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error removing from collection:", error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowModal(true)} 
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
        }`}
      >
        {saved ? 
          <FaBookmark className="text-yellow-400 text-xl" /> : 
          <FaRegBookmark className="text-yellow-400 text-xl" />
        }
      </button>

      {showModal && (
        <CollectionForm
          userId={userId}
          newsId={newsId}
          onSave={handleSave}
          onRemove={handleRemove}
          onClose={() => setShowModal(false)}
          isSaved={saved}
        />
      )}
    </div>
  );
};

export default CollectionButton;