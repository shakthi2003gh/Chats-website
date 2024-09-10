import axios from "axios";
import { toast } from "react-toastify";
import userLocalDB from "../indexedDB/userDB";

export const networkErrorMsg = "Network error. Check your connection.";

export default class Request {
  timeout;
  isShowNetwortMessage = true;
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
      if (message !== networkErrorMsg) toast.error(message);
      reject(message);

      if (message === networkErrorMsg) {
        if (this.isShowNetwortMessage) toast.error(message);
        if (this.timeout) clearTimeout(this.timeout);

        this.isShowNetwortMessage = false;
        this.timeout = setTimeout(() => {
          this.isShowNetwortMessage = true;
        }, 10000);
      }
    };

    return (res) => {
      const { response, code } = res;
      const { message, data, status } = response?.data || {};

      if (code === "ERR_NETWORK") return alert(networkErrorMsg);
      if (data) return reject({ ...data, message, status });
      if (message) return alert(message);

      alert("Somthing went wrong on the server.");
    };
  }

  GET(path, cb = this.defaultCB) {
    return new Promise(async (resolve, reject) => {
      const config = await this.getConfig();

      this.request
        .get(this.basePath + path, config)
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
