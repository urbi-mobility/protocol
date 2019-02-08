const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/");

const payload = {
  nonce: "" + Math.ceil(Math.random() * 1e18),
  firstName: "Gianni",
  lastName: "Cipolla",
  nationality: "IT",
  birthDate: "1950-01-22",
  birthNation: "Italy",
  birthProvince: "GE",
  birthLocality: "Arenzano",
  address: "Via Tasso 11",
  zip: "101010",
  city: "Milano",
  country: "Italy",
  phoneNumber: null,
  dlNumber: "AB123",
  dlIssuer: "Motorizzazione civile",
  dlIssueDate: "2010-02-08",
  dlExpirationDate: "",
  dlLevels: { B1: true, A: true }
};

function serialize(obj) {
  function sortAndClean(obj) {
    const keys = Object.keys(obj).sort();
    const sorted = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = obj[key];

      if (value === null) {
        continue;
      }

      if (value.constructor === Object) {
        value = sortAndClean(value);
      }

      sorted[key] = value;
    }

    return sorted;
  }
  return JSON.stringify(sortAndClean(obj));
}

function sign(obj, privateKey) {
  const msg = serialize(obj);
  return web3.eth.accounts.sign(msg, privateKey);
}

function verify(data) {
  const msg = serialize(data.payload);
  return web3.eth.accounts.recover(msg, data.signature) === data.address;
}

function main() {
  const account = web3.eth.accounts.create();
  const signature = sign(payload, account.privateKey).signature;

  const data = {
    address: account.address,
    signature: signature,
    payload: payload
  };

  console.log(JSON.stringify(data, null, 2));
  console.log(verify(data));
}

main();
