// Function to compute base^expo mod m using BigInt
function power(base, expo, m) {
    let res = BigInt(1);
    base = BigInt(base) % BigInt(m);
    while (expo > 0) {
        if (expo & BigInt(1)) {
            res = (res * base) % BigInt(m);
        }
        base = (base * base) % BigInt(m);
        expo = Math.floor(Number(expo) / 2);
        expo = BigInt(expo);
    }
    return res;
}

// Function to find modular inverse of e modulo phi(n)
function modInverse(e, phi) {
    e = BigInt(e);
    phi = BigInt(phi);
    for (let d = BigInt(2); d < phi; d++) {
        if ((e * d) % phi === BigInt(1)) {
            return d;
        }
    }
    return -1;
}

// RSA Key Generation
function generateKeys(p, q) {
    p = BigInt(p);
    q = BigInt(q);

    let n = p * q;
    let phi = (p - BigInt(1)) * (q - BigInt(1));

    // Choose e, where 1 < e < phi(n) and gcd(e, phi(n)) == 1
    let e;
    for (e = BigInt(2); e < phi; e++) {
        if (gcd(e, phi) === BigInt(1))
            break;
    }

    // Compute d such that e * d ≡ 1 (mod phi(n))
    let d = modInverse(e, phi);
    return { e, d, n };
}

function gcd(a, b) {
    while (b !== BigInt(0)) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Encrypt message using public key (e, n)
function encrypt(m, e, n) {
    return power(m, e, n);
}

// Decrypt message using private key (d, n)
function decrypt(c, d, n) {
    return power(c, d, n);
}

function charToValue(c) {
    if (c >= '0' && c <= '9') return BigInt(c.charCodeAt(0) - 48);
    if (c >= 'A' && c <= 'Z') return BigInt(c.charCodeAt(0) - 55);
    if (c >= 'a' && c <= 'z') return BigInt(c.charCodeAt(0) - 87);
    return -1n; // invalid
}

function convertToBigInt(str, base) {
    let result = 0n;
    let b = BigInt(base);

    for (let i = 0; i < str.length; i++) {
        let digit = charToValue(str[i]);

        if (digit === -1n || digit >= b) {
            throw new Error(`Ký tự '${str[i]}' không hợp lệ với base ${base}`);
        }

        result = result * b + digit;
    }

    return result;
}

let ee1 = 7;
let p1 = convertToBigInt("11", ee1);
let q1 = convertToBigInt("17", ee1);

let ee2 = 17;
let p2 = convertToBigInt("20079993872842322116151219", ee2);
let q2 = convertToBigInt("676717145751736242170789", ee2);

// Key Generation
let { e1, d1, n1 } = generateKeys(p1, q1);
// let { e2, d2, n2 } = generateKeys(p2, q2);



console.log(`Public Key (e, n): (${e1}, ${n1})`);
console.log(`Private Key (d, n): (${d1}, ${n1})`);

// console.log(`Public Key (e, n): (${e2}, ${n2})`);
// console.log(`Private Key (d, n): (${d2}, ${n2})`);