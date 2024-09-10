import Request from "./config";

const request = new Request("/public");

function defaultCallBack(resolve) {
  return ({ data }) => {
    resolve(data);
  };
}

export class PublicHTTP {
  static getPeople() {
    return request.GET("/users", defaultCallBack);
  }
}
