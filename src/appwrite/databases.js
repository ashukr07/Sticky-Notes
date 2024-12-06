import { databases,collections } from "./config";
import { ID } from "appwrite";

const db = {}

collections.forEach(collection => {
    db[collection.name] = {
        create: async (payload, id = ID.unique()) => {
            return await databases.createDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            )
        },
        update: async (id, payload) => {
            return await databases.updateDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            )
        },
        delete: async (id) => {
            return await databases.deleteDocument(
                collection.dbId,
                collection.id,
                id
            )
        },
        list :async (queries) => {
            return await databases.listDocuments(
                collection.dbId,
                collection.id,
                queries
            )
        },
        get: async (id) => {
            return await databases.getDocument(
                collection.dbId,
                collection.id,
                id
            )
        }
    }
})

// this is the wrapper for the appwrite database service that we will use to interact with the database
// we will use this wrapper to create, update, delete, list and get documents from the database
//this will make it more  readable otherwise if we use the appwrite service directly we need to pass database id, collection id and document id every time we want to interact with the database

export {db}