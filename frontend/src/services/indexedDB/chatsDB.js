import Localbase from "localbase";

class ChatsLocalDB {
  constructor() {
    this.db = new Localbase("ChatsDB");
    this.db.config.debug = false;
  }

  getChats(collectionName = "personalChats") {
    return this.db.collection(collectionName).get();
  }

  addChat(chat, collectionName = "personalChats") {
    return this.db.collection(collectionName).add(chat, chat._id);
  }

  async addChats(chats, collectionName = "personalChats") {
    if (!chats) return;

    await this.removeChats();

    return chats.forEach((chat) => {
      this.db.collection(collectionName).add(chat, chat._id);
    });
  }

  addMessage(chat_id, messages, lastMessage, collectionName = "personalChats") {
    const user_id = sessionStorage.getItem("user_id");
    let unreadCount = 0;
    messages.forEach(({ readReceipt, author }) => {
      if (author._id !== user_id && readReceipt !== "seen") ++unreadCount;
    });

    this.db
      .collection(collectionName)
      .doc({ _id: chat_id })
      .update({ messages, unreadCount, lastMessage });
  }

  removeChats(collectionName = "personalChats") {
    return this.getChats(collectionName).then((chat) => {
      if (!chat?.length) return;
      return this.db.collection(collectionName).doc({}).delete();
    });
  }
}

export default new ChatsLocalDB();
