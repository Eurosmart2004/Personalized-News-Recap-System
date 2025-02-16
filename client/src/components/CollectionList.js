import React, { useEffect, useState } from "react";
import { useAxios } from "../axios/axios";
import NewsCard from "./NewsCard";
import { toast } from "react-toastify";

const CollectionList = ({ collections, selectedCollection, onSelectCollection, onDeleteCollection }) => {
  const [newsItems, setNewsItems] = useState([]);
  const { privateAxios } = useAxios();
  const [showConfirm, setShowConfirm] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  // Fetch news articles associated with the selected collection
  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedCollection) return;
      try {
        const response = await privateAxios.get(`/collection/${selectedCollection.id}`);
        console.log("Collection API Response:", response);

        // Ensuring the response contains a valid news list
        const fetchedNews = Array.isArray(response.data.favorites) ? response.data.favorites : [];
        setNewsItems(fetchedNews);
      } catch (error) {
        console.error("Error fetching collection news:", error);
        toast.error("Failed to fetch news for the selected collection.");
      }
    };
    fetchNews();
  }, [privateAxios, selectedCollection]);

  // Delete confirmation modal handlers
  const confirmDelete = (collectionId) => {
    setCollectionToDelete(collectionId);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (collectionToDelete) {
      try {
        await onDeleteCollection(collectionToDelete);
        toast.success("Collection deleted successfully.");
      } catch (error) {
        toast.error("Error deleting collection.");
        console.error("Error deleting collection:", error);
      } finally {
        setShowConfirm(false);
        setCollectionToDelete(null);
      }
    }
  };

  return (
    <div className="mt-6 h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <h2 className="text-xl font-bold mb-4">Select a Collection</h2>

        {/* Collection Selection + Delete Button */}
        <div className="flex gap-4 mb-6">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center gap-2">
              <button
                onClick={() => onSelectCollection(collection)}
                className={`px-4 py-2 rounded ${
                  selectedCollection?.id === collection.id ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {collection.name}
              </button>
              {/* Delete Collection Button */}
              <button
                onClick={() => confirmDelete(collection.id)}
                className="text-red-500"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        {/* Display News in Selected Collection */}
        {selectedCollection && (
          <>
            <h3 className="text-lg font-semibold mb-4">News in {selectedCollection.name}</h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.length === 0 ? (
                <p>No news saved in this collection.</p>
              ) : (
                newsItems.map((news) => (
                  <div key={news.id}>
                    <NewsCard news={news} />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="text-lg font-semibold mb-4">Are you sure you want to delete this collection?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;