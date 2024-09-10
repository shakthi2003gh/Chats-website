import { toast } from "react-toastify";
import Request from "./config";
import userLocalDB from "../indexedDB/userDB";

const request = new Request("/user");

function defaultCallBack(resolve) {
  return ({ data }) => {
    toast.success(data.message);
    resolve();
  };
}

function loginCallBack() {
  return (resolve) =>
    async ({ data, headers }) => {
      const token = headers.get("Authorization");

      await userLocalDB.addToken(token);
      resolve(data);
    };
}

export class UserHTTP {
  static auth() {
    return request.POST("/auth", {}, loginCallBack());
  }

  static login(payload, withDevice = false) {
    payload.userAgent = navigator.userAgent;

    const path = withDevice ? "?without=device" : "";
    return request.POST("/login" + path, payload, loginCallBack());
  }

  static logout() {
    return request.POST("/logout", {}, defaultCallBack);
  }

  static register(payload) {
    return request.POST("/register", payload, defaultCallBack);
  }

  static otpResend(payload) {
    return request.POST("/register/otp-resend", payload, defaultCallBack);
  }

  static verify(payload) {
    const cb = loginCallBack();
    payload.userAgent = navigator.userAgent;

    return request.POST("/verify", payload, cb);
  }

  static update(payload) {
    return request.PATCH("/", payload, defaultCallBack);
  }
}
