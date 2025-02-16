import React, { useState, useEffect, useCallback } from "react";
import CollectionList from "../components/CollectionList";
import CollectionForm from "../components/CollectionForm";
import { useAxios } from "../axios/axios";
import { useSelector } from "react-redux";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const auth = useSelector((state) => state.auth);
  const { privateAxios } = useAxios();

  const fetchCollections = useCallback(async () => {
    try {
      const response = await privateAxios.get(`/collection/${auth.user.id}`);
      const fetchedCollections = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.collections)
        ? response.data.collections
        : [];
      console.log("Fetched Collections:", fetchedCollections); // Log fetched collections
      setCollections(fetchedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]); // Ensure collections is always an array
    }
  }, [privateAxios, auth.user.id]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCollectionAdded = () => {
    fetchCollections(); // Refresh the list after adding
  };

  const handleCollectionDeleted = async (collectionId) => {
    try {
      await privateAxios.delete(`/collection/${collectionId}`);
      setCollections(collections.filter((col) => col.id !== collectionId));
      setSelectedCollection(null);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div>
      <h1 className="ml-4 text-4xl font-bold dark:text-gray-100">Your Collections</h1>
      
      {/* Collection Form for Adding New Collections
      <CollectionForm onCollectionAdded={handleCollectionAdded} /> */}

      {/* Display Collections */}
      {Array.isArray(collections) ? (
        <CollectionList
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionAdded={handleCollectionAdded}
          onSelectCollection={setSelectedCollection}
          onDeleteCollection={handleCollectionDeleted}
        />
      ) : (
        <p className="ml-4 mt-4">Loading collections...</p>
      )}
    </div>
  );
};

export default CollectionPage;