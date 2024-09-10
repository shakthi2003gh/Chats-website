import Localbase from "localbase";

class ChatsLocalDB {
  constructor() {
    this.db = new Localbase("ChatsDB");
    this.db.config.debug = false;
  }

  getChats() {
    const collectionName = "personalChats";

    return this.db.collection(collectionName).get();
  }

  addChat(chat) {
    const collectionName = "personalChats";

    return this.db.collection(collectionName).add(chat, chat._id);
  }

  async addChats(chats) {
    if (!chats) return;

    const collectionName = "personalChats";
    await this.removeChats();

    return chats.forEach((chat) => {
      this.db.collection(collectionName).add(chat, chat._id);
    });
  }

  addMessage(chat_id, messages, lastMessage) {
    const user_id = sessionStorage.getItem("user_id");
    let unreadCount = 0;
    messages.forEach(({ readReceipt, author }) => {
      if (author._id !== user_id && readReceipt !== "seen") ++unreadCount;
    });

    this.db
      .collection("personalChats")
      .doc({ _id: chat_id })
      .update({ messages, unreadCount, lastMessage });
  }

  removeChats() {
    return this.getChats().then((chat) => {
      if (!chat?.length) return;
      return this.db.collection("personalChats").doc({}).delete();
    });
  }
}

export default new ChatsLocalDB();
