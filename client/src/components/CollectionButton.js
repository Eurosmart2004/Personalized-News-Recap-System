import React, { useState, useEffect } from "react";
import { useAxios } from "../axios/axios";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import CollectionButtonForm from "./ColectionButtonForm";

const CollectionButton = ({ userId, newsId, isSaved, theme }) => {
  const [saved, setSaved] = useState(isSaved);
  const [showModal, setShowModal] = useState(false);
  const { privateAxios } = useAxios();

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);


  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full transition-colors duration-300 hover:bg-yellow-400 dark:hover:bg-yellow-100 group"
      >
        {saved ? (
          <FaBookmark className="text-yellow-400 text-xl transition-colors duration-300 group-hover:text-white" />
        ) : (
          <FaRegBookmark className="text-yellow-400 text-xl transition-colors duration-300 group-hover:text-white" />
        )}
      </button>


      {showModal && (
        <CollectionButtonForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          userId={userId}
          newsId={newsId}
        />
      )}
    </div>
  );
};

export default CollectionButton;