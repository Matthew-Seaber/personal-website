import { Client, TablesDB } from "node-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_USERS_API_KEY!);

export const tablesDB = new TablesDB(client);

export { ID } from "node-appwrite";
