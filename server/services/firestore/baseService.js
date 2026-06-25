const { firestore, isInitialized, initError } = require('../../config/firebase');

/**
 * Custom error class for Firestore service layer to centralize error handling.
 */
class FirestoreServiceError extends Error {
  constructor(message, originalError = null, collection = '', action = '') {
    super(message);
    this.name = 'FirestoreServiceError';
    this.originalError = originalError;
    this.collection = collection;
    this.action = action;
    this.status = 500;
  }
}

/**
 * Centralized error handler that formats and throws errors.
 */
const handleFirestoreError = (action, collection, error) => {
  const message = `Firestore Service Error [${action}] on collection [${collection}]: ${error.message}`;
  console.error(message, error);
  throw new FirestoreServiceError(message, error, collection, action);
};

/**
 * Helper to get the firestore collection reference, ensuring Firebase is initialized.
 */
const getCollection = (collectionName) => {
  if (!isInitialized || !firestore) {
    throw new FirestoreServiceError(
      `Firestore is not initialized. Reason: ${initError || 'Firebase configuration environment variables are missing.'}`,
      null,
      collectionName,
      'initialize'
    );
  }
  return firestore.collection(collectionName);
};

const createService = (collectionName) => {
  return {
    /**
     * Create a new document in the collection.
     * @param {Object} data 
     * @returns {Promise<Object>} The created document data.
     */
    async create(data) {
      try {
        const col = getCollection(collectionName);
        let docRef;
        const record = { ...data };
        
        if (data && data.id) {
          docRef = col.doc(data.id);
        } else {
          docRef = col.doc();
          record.id = docRef.id;
        }

        record.createdAt = record.createdAt || new Date();
        record.updatedAt = new Date();

        await docRef.set(record);
        return record;
      } catch (error) {
        handleFirestoreError('create', collectionName, error);
      }
    },

    /**
     * Get a document by ID.
     * @param {string} id 
     * @returns {Promise<Object|null>} The document data or null if not found.
     */
    async getById(id) {
      try {
        if (!id) {
          throw new Error('ID parameter is required');
        }
        const col = getCollection(collectionName);
        const doc = await col.doc(id).get();
        if (!doc.exists) {
          return null;
        }
        return doc.data();
      } catch (error) {
        handleFirestoreError('getById', collectionName, error);
      }
    },

    /**
     * Get all documents in the collection.
     * @returns {Promise<Array<Object>>} List of all documents.
     */
    async getAll() {
      try {
        const col = getCollection(collectionName);
        const snapshot = await col.get();
        const results = [];
        snapshot.forEach(doc => {
          results.push(doc.data());
        });
        return results;
      } catch (error) {
        handleFirestoreError('getAll', collectionName, error);
      }
    },

    /**
     * Update a document by ID.
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object>} The updated document data.
     */
    async update(id, data) {
      try {
        if (!id) {
          throw new Error('ID parameter is required');
        }
        const col = getCollection(collectionName);
        const docRef = col.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
          throw new Error(`Document with ID ${id} not found`);
        }

        const updatedData = { ...data, updatedAt: new Date() };
        await docRef.update(updatedData);

        // Fetch and return the updated document
        const updatedDoc = await docRef.get();
        return updatedDoc.data();
      } catch (error) {
        handleFirestoreError('update', collectionName, error);
      }
    },

    /**
     * Delete a document by ID.
     * @param {string} id 
     * @returns {Promise<Object>} Outcome of the delete operation.
     */
    async delete(id) {
      try {
        if (!id) {
          throw new Error('ID parameter is required');
        }
        const col = getCollection(collectionName);
        const docRef = col.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
          throw new Error(`Document with ID ${id} not found`);
        }

        await docRef.delete();
        return { id, success: true };
      } catch (error) {
        handleFirestoreError('delete', collectionName, error);
      }
    }
  };
};

module.exports = {
  createService,
  FirestoreServiceError,
  handleFirestoreError,
  getCollection
};
