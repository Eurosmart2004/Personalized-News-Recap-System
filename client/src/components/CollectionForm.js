import React, { useState, useEffect, useCallback } from "react";
import { useAxios } from "../axios/axios";
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CollectionForm = ({ userId, newsId, onSave, onRemove, onClose, isSaved }) => {
  const [collections, setCollections] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [error, setError] = useState("");
  const { privateAxios } = useAxios();

  const fetchCollections = useCallback(async () => {
    try {
      const response = await privateAxios.get(`/collection/${userId}`);
      setCollections(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
    }
  }, [privateAxios, userId]);

  useEffect(() => {
    fetchCollections();
  }, [privateAxios, userId, fetchCollections]);

  const handleCreateCollection = async () => {
    try {
        const trimmedName = newCollectionName.trim();
        if (!trimmedName) {
            setError("Collection name cannot be empty");
            toast.error("Collection name cannot be empty");
            return;
        }

        // Check for duplicates
        const isDuplicate = collections.some(
            (collection) => collection.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            setError("A collection with this name already exists");
            toast.error("A collection with this name already exists");
            return;
        }

        // Create new collection
        const response = await privateAxios.post('/collection', {
            name: trimmedName,
            user_id: userId
        });

        console.log("Create Collection Response:", response); // Log API response

        if (!response.data || !response.data.id) {
            throw new Error("Server did not return collection data");
        }

        // Automatically save the news to the newly created collection
        const response_news = privateAxios.post(`/collection/${response.data.id}/add`, { news_id: newsId });

        

        setNewCollectionName("");
        setIsCreatingNew(false);
        fetchCollections();
        toast.success("Collection created and news saved successfully");
    } catch (error) {
        console.error("Error creating collection or saving news:", error);
        setError("Failed to create collection");
        toast.error("Failed to create collection");
    }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Save to Collection</h3>
          <button 
            onClick={() => {
              onClose();
              setIsCreatingNew(false);
              setNewCollectionName("");
              setError("");
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <IoMdClose className="text-xl" />
          </button>
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        {/* Create New Collection Button */}
        {!isCreatingNew && (
          <button
            onClick={() => setIsCreatingNew(true)}
            className="w-full p-3 mb-4 text-left flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaPlus className="text-gray-600" />
            <span>Create new collection</span>
          </button>
        )}

        {/* Create New Collection Form */}
        {isCreatingNew && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value);
                setError("");
              }}
              className="w-full p-2 border rounded-lg mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleCreateCollection();
                  onClose();
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create and Save
              </button>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setNewCollectionName("");
                  setError("");
                }}
                className="flex-1 bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Collections */}
        {!isCreatingNew && (
          <div className="max-h-60 overflow-y-auto">
            {collections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No collections yet</p>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onSave(collection.id)}
                  className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {collection.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionForm;