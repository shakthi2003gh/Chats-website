import Localbase from "localbase";

class UserLocalDB {
  constructor() {
    this.db = new Localbase("UserDB");
    this.db.config.debug = false;
  }

  getUser() {
    return this.getSingleItem("user");
  }

  getToken() {
    return this.getSingleItem("token");
  }

  addUser(user) {
    return this.db.collection("user").add(user, user._id);
  }

  addToken(token) {
    return this.db.collection("token").add({ token });
  }

  async removeUser() {
    await this.removeToken();

    return this.db.collection("user").delete();
  }

  removeToken() {
    return this.db.collection("token").delete();
  }

  getSingleItem(collectionName) {
    return this.db
      .collection(collectionName)
      .get()
      .then((data) => {
        if (data[0]) return data[0];
        return null;
      });
  }
}

export default new UserLocalDB();
