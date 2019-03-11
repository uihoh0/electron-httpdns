"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _url() {
  const data = require("url");

  _url = function () {
    return data;
  };

  return data;
}

class HttpDnsURL extends _url().URL {
  constructor(input, base, options) {
    super(input, base);
    const tmp = new (_url().URL)(input, base);
    this._originHostName = tmp.hostname;
    this._ip = options && options.ip;
  }

  get href() {
    const url = this;
    let href = `${url.protocol}//${url.ip || url.hostname}`;

    if (url.port) {
      href += `:${url.port}`;
    }

    href += `${url.pathname}${url.search}`;
    return href;
  }

  get hostname() {
    return this._ip || this._originHostName || this.host;
  }

  set host(str) {
    this._originHostName = str;
    this.host = str;
  }

  get host() {
    return this._originHostName || this.host || this.hostname;
  }

  get ip() {
    return this._ip;
  }

  set ip(ip) {
    this._ip = ip;
  }

} exports.default = HttpDnsURL;
// __ts-babel@6.0.4
//# sourceMappingURL=HttpDnsURL.js.map