"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dnsResolverManager;

function _AliIPResolver() {
  const data = _interopRequireDefault(require("./AliIPResolver"));

  _AliIPResolver = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let resolver = false;

async function dnsResolverManager(httpdns) {
  if (resolver) {
    return resolver;
  }

  if (!httpdns) {
    return false;
  }

  switch (httpdns.type) {
    case 'ali':
      resolver = new (_AliIPResolver().default)(httpdns);
      break;

    default:
      break;
  }

  return resolver;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=dnsResolverManager.js.map