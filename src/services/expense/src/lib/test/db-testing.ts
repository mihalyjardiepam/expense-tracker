import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export class DbTestingModule {
  static #mongoMemoryServer: MongoMemoryServer;

  constructor(public testName: string) {}

  static async init() {
    this.#mongoMemoryServer = await MongoMemoryServer.create();
  }

  public async mongodbConnect() {
    const uri = DbTestingModule.#mongoMemoryServer.getUri();

    await mongoose.connect(uri, {
      dbName: `test-${this.testName}`,
    });
  }

  public async mongodbCloseDb() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await DbTestingModule.#mongoMemoryServer.stop();
  }

  public async mongodbResetDb() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}
