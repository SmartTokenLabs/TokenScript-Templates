import BN from 'bn.js';
import { hexStringToUint8, uint8tohex } from './helpers';

// Encoding Uint8Array|string
function setPrivateKey(priv) {
	if (!(priv instanceof Uint8Array)) {
		priv = hexStringToUint8(priv);
	}
	this._priv = new BN(priv);
	return this;
}

export function DH(prime, generator) {
	this.setGenerator(generator);
	this.__prime = new BN(prime);
	this._prime = BN.mont(this.__prime);
	this._primeLen = prime.length;
	this._pub = undefined;
	this._priv = undefined;
	this._primeCode = undefined;
	this.setPrivateKey = setPrivateKey;
}

DH.prototype.generateKeys = function () {
	if (!this._priv) {
		throw new Error('Private key must be defined');
	}
	this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
	return this.getPublicKey();
};

// other must be Uint8Array
DH.prototype.computeSecret = function (other) {
	if (!(other instanceof Uint8Array)) {
		throw new Error('computeSecret param must be Uint8Array');
	}
	if (other.length != 32) {
		throw new Error('wrong shared secret length');
	}
	other = new BN(other);
	other = other.toRed(this._prime);
	var secret = other.redPow(this._priv).fromRed();
	var out = uint8tohex(new Uint8Array(secret.toArray()));
	return out.padStart(this.getPrime().length, '0');
};

DH.prototype.getPublicKey = function getPublicKey() {
	return formatReturnValue(this._pub);
};

DH.prototype.getPrime = function () {
	return formatReturnValue(this.__prime);
};

DH.prototype.getGenerator = function () {
	return formatReturnValue(this._gen);
};

DH.prototype.setGenerator = function (gen) {
	if (!(gen instanceof Uint8Array)) {
		gen = hexStringToUint8(gen);
	}
	this.__gen = gen;
	this._gen = new BN(gen);
	return this;
};

function formatReturnValue(bn) {
	return uint8tohex(new Uint8Array(bn.toArray()));
}
