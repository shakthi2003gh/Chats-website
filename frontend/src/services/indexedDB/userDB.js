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

  async addToken(token) {
    await this.removeToken();

    return this.db.collection("token").add({ token });
  }

  updateUser(details) {
    this.getUser().then(({ _id }) => {
      this.db.collection("user").doc({ _id }).update(details);
    });
  }

  removeUser() {
    return this.getUser().then(async (user) => {
      await this.removeToken();

      if (user) return this.db.collection("user").doc({}).delete();
    });
  }

  removeToken() {
    return this.getToken().then((token) => {
      if (token) return this.db.collection("token").doc({}).delete();
    });
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
