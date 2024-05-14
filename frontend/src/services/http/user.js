import { toast } from "react-toastify";
import Request from "./config";
import userLocalDB from "../indexedDB/userDB";

const request = new Request("/user");

const loginSuccessFully = "Login successfully";
const verifiedSuccessFully = "Verified successfully";

function defaultCallBack(resolve) {
  return ({ data }) => {
    toast.success(data.message);
    resolve();
  };
}

function loginCallBack(message) {
  return (resolve) =>
    async ({ data, headers }) => {
      const token = headers.get("Authorization");

      await userLocalDB.addToken(token);
      toast.success(message);
      resolve(data);
    };
}

export class UserHTTP {
  static login(payload) {
    return request.POST("/login", payload, loginCallBack(loginSuccessFully));
  }

  static register(payload) {
    return request.POST("/register", payload, defaultCallBack);
  }

  static otpResend(payload) {
    return request.POST("/register/otp-resend", payload, defaultCallBack);
  }

  static verify(payload) {
    const cb = loginCallBack(verifiedSuccessFully);
    return request.POST("/verify", payload, cb);
  }
}
