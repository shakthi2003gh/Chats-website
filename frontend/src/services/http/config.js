import axios from "axios";
import { toast } from "react-toastify";
import userLocalDB from "../indexedDB/userDB";

export default class Request {
  request = axios.create({ baseURL: import.meta.env.VITE_ENDPOINT });
  defaultCB = (resolve) => resolve();

  constructor(basePath) {
    this.basePath = basePath;
  }

  getConfig = async () => {
    const { token } = (await userLocalDB.getToken()) || {};

    return { headers: { Authorization: token } };
  };

  handleCatch(reject) {
    const alert = (message) => {
      toast.error(message);
      reject(message);
    };

    return (res) => {
      const { response, code } = res;
      const { message } = response?.data || {};

      if (code === "ERR_NETWORK") return alert("Network Error");
      if (message) return alert(message);

      alert("Somthing went wrong on the server.");
    };
  }

  GET(path, cb = this.defaultCB) {
    return new Promise(async (resolve, reject) => {
      const config = await this.getConfig();

      this.request
        .post(this.basePath + path, payload, config)
        .then(cb(resolve))
        .catch(this.handleCatch(reject));
    });
  }

  POST(path, payload, cb = this.defaultCB) {
    return new Promise(async (resolve, reject) => {
      const config = await this.getConfig();

      this.request
        .post(this.basePath + path, payload, config)
        .then(cb(resolve))
        .catch(this.handleCatch(reject));
    });
  }

  PATCH(path, payload, cb = this.defaultCB) {
    return new Promise(async (resolve, reject) => {
      const config = await this.getConfig();

      this.request
        .patch(this.basePath + path, payload, config)
        .then(cb(resolve))
        .catch(this.handleCatch(reject));
    });
  }

  DELETE(path, cb = this.defaultCB) {
    return new Promise(async (resolve, reject) => {
      const config = await this.getConfig();

      this.request
        .delete(this.basePath + path, config)
        .then(cb(resolve))
        .catch(this.handleCatch(reject));
    });
  }
}
