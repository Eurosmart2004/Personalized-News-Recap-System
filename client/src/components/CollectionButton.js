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
        className={`p-2 rounded-full transition-colors hover:bg-gray-400 dark:hover:bg-gray-100 duration-300
          }`}
      >
        {saved ?
          <FaBookmark className="text-yellow-400 text-xl" /> :
          <FaRegBookmark className="text-yellow-400 text-xl" />
        }
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