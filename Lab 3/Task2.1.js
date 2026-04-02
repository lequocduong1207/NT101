// Function to compute base^expo mod m using BigInt
function power(base, expo, m) {
    let mod = BigInt(m);
    let exp = BigInt(expo);
    let b = BigInt(base) % mod;

    let res = 1n;
    while (exp > 0n) {
        if (exp & 1n) {
            res = (res * b) % mod;
        }
        b = (b * b) % mod;
        exp >>= 1n;
    }
    return res;
}

// Function to find modular inverse of e modulo phi(n)
function modInverse(e, phi) {
    let a = BigInt(e);
    let m = BigInt(phi);
    a = ((a % m) + m) % m;
    if (m === 0n) return -1n;

    // Extended Euclidean Algorithm: finds x,y s.t. a*x + m*y = gcd(a,m)
    let oldR = a, r = m;
    let oldS = 1n, s = 0n;

    while (r !== 0n) {
        let q = oldR / r;
        [oldR, r] = [r, oldR - q * r];
        [oldS, s] = [s, oldS - q * s];
    }

    // oldR = gcd(a,m); oldS = modular inverse if gcd == 1
    if (oldR !== 1n) return -1n;
    return ((oldS % m) + m) % m;
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

// RSA Key Generation with provided public exponent e
function generateKeysWithE(p, q, e) {
    p = BigInt(p);
    q = BigInt(q);
    e = BigInt(e);

    let n = p * q;
    let phi = (p - 1n) * (q - 1n);

    if (e <= 1n || e >= phi) {
        throw new Error("e không hợp lệ (cần 1 < e < phi)");
    }
    if (gcd(e, phi) !== 1n) {
        throw new Error("Không tồn tại nghịch đảo modular vì gcd(e, phi) != 1");
    }

    let d = modInverse(e, phi);
    if (d === -1n) {
        throw new Error("Không tìm được d (modInverse thất bại)");
    }

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
    str = String(str).trim();
    if (str.length === 0) {
        throw new Error("Chuỗi đầu vào rỗng");
    }
    if (!Number.isInteger(base) || base < 2 || base > 36) {
        throw new Error(`Base không hợp lệ: ${base}. Base phải trong khoảng 2..36`);
    }
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

// Test 1 (hệ thập phân)
let p1 = convertToBigInt("11", 10);
let q1 = convertToBigInt("17", 10);
let e1 = 7n;

// Test 2 (hệ thập phân)
let p2 = convertToBigInt("20079993872842322116151219", 10);
let q2 = convertToBigInt("676717145751736242170789", 10);
let e2 = 17n;

// Test 3 (hệ thập lục phân)
let p3 = convertToBigInt("F7E75FDC469067FFDC4E847C51F452DF", 16);
let q3 = convertToBigInt("E85CED54AF57E53E092113E62F436F4F", 16);
let e3 = convertToBigInt("0D88C3", 16);


// Key Generation
// 2.1.1
let { e: e1k, d: d1, n: n1 } = generateKeysWithE(p1, q1, e1);
let { e: e2k, d: d2, n: n2 } = generateKeysWithE(p2, q2, e2);
let { e: e3k, d: d3, n: n3 } = generateKeysWithE(p3, q3, e3);

// console.log(`Test 1 - Public Key (e, n): (${e1k}, ${n1})`);
// console.log(`Test 1 - Private Key (d, n): (${d1}, ${n1})`);

// console.log(`Test 2 - Public Key (e, n): (${e2k}, ${n2})`);
// console.log(`Test 2 - Private Key (d, n): (${d2}, ${n2})`);

// console.log(`Test 3 - Public Key (e, n): (${e3k}, ${n3})`);
// console.log(`Test 3 - Private Key (d, n): (${d3}, ${n3})`);

// 2.1.2

console.log("\n=== 2.1.2 M=5 ===");
let M = 5n;

// Confidentiality: encrypt with public key, decrypt with private key
let C_conf = encrypt(M, e1k, n1);
let M_conf = decrypt(C_conf, d1, n1);
console.log(`[Confidentiality] M=${M} -> C=${C_conf} -> M'=${M_conf}`);

// Authentication: sign with private key, verify with public key
let S_auth = power(M, d1, n1);
let V_auth = power(S_auth, e1k, n1);
console.log(`[Authentication]   M=${M} -> S=${S_auth} -> Verify=${V_auth}`);

// 2.1.3

function bitLength(n) {
    let x = BigInt(n);
    if (x === 0n) return 0;
    return x.toString(2).length;
}

function bigintToFixedBytes(x, length) {
    let v = BigInt(x);
    if (v < 0n) throw new Error("Không hỗ trợ BigInt âm");
    let out = new Uint8Array(length);
    for (let i = length - 1; i >= 0; i--) {
        out[i] = Number(v & 0xffn);
        v >>= 8n;
    }
    if (v !== 0n) throw new Error("BigInt quá lớn so với độ dài byte");
    return out;
}

function rsaEncryptToBytes(plainBytes, e, n) {
    let modulus = BigInt(n);
    let exp = BigInt(e);
    let blockSize = Math.ceil(bitLength(modulus) / 8);
    if (blockSize <= 0) throw new Error("n không hợp lệ");

    // Encrypt each UTF-8 byte independently (simple for lab)
    let out = new Uint8Array(plainBytes.length * blockSize);
    for (let i = 0; i < plainBytes.length; i++) {
        let m = BigInt(plainBytes[i]);
        if (m >= modulus) {
            throw new Error(`Byte ${plainBytes[i]} >= n; không thể mã hóa với modulus hiện tại`);
        }
        let c = power(m, exp, modulus);
        out.set(bigintToFixedBytes(c, blockSize), i * blockSize);
    }
    return out;
}

let message = "The University of Information Technology.";
let messageBytes = Buffer.from(message, "utf8");
// console.log(`Message: ${message}`);

function printCipherBase64(testName, e, n) {
    let cipherBytes = rsaEncryptToBytes(messageBytes, e, n);
    let cipherB64 = Buffer.from(cipherBytes).toString("base64");
    console.log(`${testName} - Ciphertext (Base64): ${cipherB64}`);
}

// printCipherBase64("Test 1", e1k, n1);
// printCipherBase64("Test 2", e2k, n2);
// printCipherBase64("Test 3", e3k, n3);

// 2.1.4

function bytesToBigint(bytes) {
    let v = 0n;
    for (let i = 0; i < bytes.length; i++) {
        v = (v << 8n) + BigInt(bytes[i]);
    }
    return v;
}

function bigintToMinimalBytes(x) {
    let v = BigInt(x);
    if (v === 0n) return new Uint8Array([0]);
    if (v < 0n) throw new Error("Không hỗ trợ BigInt âm");
    let bytes = [];
    while (v > 0n) {
        bytes.push(Number(v & 0xffn));
        v >>= 8n;
    }
    bytes.reverse();
    return new Uint8Array(bytes);
}

function cleanWhitespace(s) {
    return String(s).replace(/\s+/g, "").trim();
}

function hexToBytes(hex) {
    let h = cleanWhitespace(hex);
    if (h.length % 2 === 1) h = "0" + h;
    if (!/^[0-9a-fA-F]+$/.test(h)) throw new Error("Không phải hex");
    let out = new Uint8Array(h.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

function base64ToBytes(b64) {
    let s = cleanWhitespace(b64);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error("Không phải base64");
    return new Uint8Array(Buffer.from(s, "base64"));
}

function binToBytes(binStr) {
    let b = cleanWhitespace(binStr);
    if (!/^[01]+$/.test(b)) throw new Error("Không phải nhị phân");
    let pad = (8 - (b.length % 8)) % 8;
    if (pad) b = "0".repeat(pad) + b;
    let out = new Uint8Array(b.length / 8);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(b.slice(i * 8, i * 8 + 8), 2);
    }
    return out;
}

function scorePrintableUtf8(buf) {
    // Score based on raw bytes so we can handle non-UTF8 plaintext.
    let bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let printable = 0;
    for (let i = 0; i < bytes.length; i++) {
        let b = bytes[i];
        if (b === 9 || b === 10 || b === 13) printable++; // \t\n\r
        else if (b >= 32 && b <= 126) printable++; // ASCII printable
    }

    let score = bytes.length === 0 ? -1 : printable / bytes.length;
    let textUtf8 = Buffer.from(bytes).toString("utf8");
    let textLatin1 = Buffer.from(bytes).toString("latin1");
    return { score, textUtf8, textLatin1, bytes };
}

function effectiveScore(scoreRatio, length) {
    // Prefer results that are both printable and non-trivially long.
    // This prevents choosing a 1-byte "perfect" plaintext like ";".
    let penalty = length < 4 ? 2 : 0;
    return scoreRatio + Math.min(length, 200) * 0.01 - penalty;
}

function asciiSafe(text) {
    let out = "";
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if (code === 9 || code === 10 || code === 13) out += text[i];
        else if (code >= 32 && code <= 126) out += text[i];
        else out += ".";
    }
    return out;
}

function renderPlaintext(bytes) {
    let b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let utf8 = Buffer.from(b).toString("utf8");
    let latin1 = Buffer.from(b).toString("latin1");

    // Prefer UTF-8 if it doesn't contain replacement chars and is reasonably printable.
    let utf8HasReplacement = utf8.includes("\uFFFD");
    let utf8PrintableScore = 0;
    for (let i = 0; i < utf8.length; i++) {
        let c = utf8.charCodeAt(i);
        if (c === 9 || c === 10 || c === 13) utf8PrintableScore++;
        else if (c >= 32 && c <= 126) utf8PrintableScore++;
    }
    utf8PrintableScore = utf8.length === 0 ? 0 : utf8PrintableScore / utf8.length;

    if (!utf8HasReplacement && utf8PrintableScore >= 0.6) {
        return { best: utf8, utf8, latin1 };
    }

    // Fall back to latin1 (byte-preserving) but make it readable
    return { best: asciiSafe(latin1), utf8, latin1 };
}

function scoreTextCandidate(text) {
    if (!text) return -9999;
    let good = 0;
    let bad = 0;
    for (const ch of text) {
        const code = ch.codePointAt(0);
        if (ch === "\uFFFD") {
            bad += 5;
            continue;
        }
        if (code === 9 || code === 10 || code === 13) {
            good += 0.5;
            continue;
        }
        if (code >= 32 && code <= 126) {
            good += 1;
            continue;
        }
        // Latin-1 + Latin Extended-A/B (covers many Vietnamese characters when properly encoded)
        if (code >= 0x00A0 && code <= 0x024F) {
            good += 0.6;
            continue;
        }
        bad += 1;
    }
    // Prefer non-trivially long candidates
    const lengthBonus = Math.min(3, Math.log2(Math.max(2, text.length))) * 0.5;
    return good - bad + lengthBonus;
}

function looksLikeHexText(text) {
    const t = String(text).trim();
    return t.length >= 8 && t.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(t);
}

function looksLikeBase64Text(text) {
    const t = String(text).trim();
    if (t.length < 12 || t.length % 4 !== 0) return false;
    if (!/^[A-Za-z0-9+/=\r\n]+$/.test(t)) return false;
    // Avoid mistaking short random strings as base64.
    return /[A-Za-z]/.test(t);
}

function utf16beFromBytes(bytes) {
    if (bytes.length % 2 !== 0) return null;
    const swapped = Buffer.alloc(bytes.length);
    for (let i = 0; i < bytes.length; i += 2) {
        swapped[i] = bytes[i + 1];
        swapped[i + 1] = bytes[i];
    }
    return swapped.toString("utf16le");
}

function bestEffortTextFromBytes(bytes) {
    const buf = Buffer.from(bytes);
    const candidates = [];

    const utf8 = buf.toString("utf8");
    candidates.push({ name: "utf8", text: utf8 });

    const latin1 = buf.toString("latin1");
    candidates.push({ name: "latin1", text: latin1 });

    if (bytes.length % 2 === 0) {
        candidates.push({ name: "utf16le", text: buf.toString("utf16le") });
        const be = utf16beFromBytes(bytes);
        if (be != null) candidates.push({ name: "utf16be", text: be });
    }

    // Second-pass: if the decoded text itself looks like hex/base64, decode it and try UTF-8 again.
    for (const c of [...candidates]) {
        const t = String(c.text).trim();
        if (looksLikeHexText(t)) {
            try {
                const inner = Buffer.from(t, "hex");
                candidates.push({ name: `${c.name}->hex->utf8`, text: inner.toString("utf8") });
            } catch {}
        } else if (looksLikeBase64Text(t)) {
            try {
                const inner = Buffer.from(t, "base64");
                candidates.push({ name: `${c.name}->b64->utf8`, text: inner.toString("utf8") });
            } catch {}
        }
    }

    let best = { name: "", text: "", score: -99999 };
    for (const c of candidates) {
        const score = scoreTextCandidate(c.text);
        if (score > best.score) best = { ...c, score };
    }
    return best;
}

function rsaDecryptBytesPerByte(cipherBytes, d, n) {
    let modulus = BigInt(n);
    let exp = BigInt(d);
    let blockSize = Math.ceil(bitLength(modulus) / 8);
    if (blockSize <= 0) throw new Error("n không hợp lệ");
    if (cipherBytes.length % blockSize !== 0) return null;

    let blocks = cipherBytes.length / blockSize;
    let out = new Uint8Array(blocks);
    for (let i = 0; i < blocks; i++) {
        let block = cipherBytes.subarray(i * blockSize, (i + 1) * blockSize);
        let c = bytesToBigint(block);
        let m = power(c, exp, modulus);
        if (m < 0n || m > 255n) return null;
        out[i] = Number(m);
    }
    return out;
}

function rsaDecryptSingleBigint(cipherBytes, d, n) {
    let modulus = BigInt(n);
    let exp = BigInt(d);
    let c = bytesToBigint(cipherBytes);
    let m = power(c, exp, modulus);
    return bigintToMinimalBytes(m);
}

function concatBytes(chunks) {
    let total = 0;
    for (let c of chunks) total += c.length;
    let out = new Uint8Array(total);
    let offset = 0;
    for (let c of chunks) {
        out.set(c, offset);
        offset += c.length;
    }
    return out;
}

// Mode C: ciphertext is a concatenation of RSA blocks (each blockSize bytes)
function rsaDecryptCipherBlocks(cipherBytes, d, n) {
    let modulus = BigInt(n);
    let exp = BigInt(d);
    let blockSize = Math.ceil(bitLength(modulus) / 8);
    if (blockSize <= 0) throw new Error("n không hợp lệ");
    if (cipherBytes.length % blockSize !== 0) return null;

    let blocks = cipherBytes.length / blockSize;
    let plainChunks = [];
    for (let i = 0; i < blocks; i++) {
        let block = cipherBytes.subarray(i * blockSize, (i + 1) * blockSize);
        let c = bytesToBigint(block);
        let m = power(c, exp, modulus);
        // Keep minimal bytes for each decrypted block (strips leading zeros)
        plainChunks.push(bigintToMinimalBytes(m));
    }
    return concatBytes(plainChunks);
}

function rsaDecryptCipherBlocksFixed(cipherBytes, d, n) {
    let modulus = BigInt(n);
    let exp = BigInt(d);
    let blockSize = Math.ceil(bitLength(modulus) / 8);
    if (blockSize <= 1) return null;
    if (cipherBytes.length % blockSize !== 0) return null;

    // Common convention: plaintext blocks use (blockSize - 1) bytes to ensure < n.
    let outBlockSize = blockSize - 1;
    let blocks = cipherBytes.length / blockSize;
    let out = new Uint8Array(blocks * outBlockSize);

    for (let i = 0; i < blocks; i++) {
        let block = cipherBytes.subarray(i * blockSize, (i + 1) * blockSize);
        let c = bytesToBigint(block);
        let m = power(c, exp, modulus);
        let plainBlock;
        try {
            plainBlock = bigintToFixedBytes(m, outBlockSize);
        } catch {
            return null;
        }
        out.set(plainBlock, i * outBlockSize);
    }
    return out;
}

function parseCipherToBytes(raw) {
    let v = cleanWhitespace(String(raw));

    // Unambiguous formats first
    if (/^[01]+$/.test(v)) {
        return binToBytes(v);
    }
    if (/^[0-9a-fA-F]+$/.test(v)) {
        return hexToBytes(v);
    }

    // Fallback to Base64
    return base64ToBytes(v);
}

let keys = [
    { name: "Test 1", d: d1, n: n1 },
    { name: "Test 2", d: d2, n: n2 },
    { name: "Test 3", d: d3, n: n3 },
];

let ciphertextInputs = [
    {
        label: "Cipher #1",
        value: "raUcesUlOkx/8ZhgodMoo0Uu18sC20yXlQFevSu7W/FDxIy0YRHMyXcHdD9PBvIT2aUft5fCQEGomiVVPv4I",
    },
    {
        label: "Cipher #2",
        value: "C87F570FC4F699CEC24020C6F54221ABAB2CE0C3",
    },
    {
        label: "Cipher #3",
        value: "Z2BUSkJcg0w4XEpgm0JcMExEQmBlVH6dYEpNTHpMHptMQ7NgTHlgQrNMQ2BKTQ==",
    },
    {
        label: "Cipher #4",
        value: "001010000001010011111111101101110010111011001010111011000110011110111111001111110110100011001111001100001001010001010100111101010100110011101110111011110101101100000100",
    },
];

function summarizeText(text) {
    let t = String(text).replace(/\r\n/g, "\n");
    if (t.length > 200) return t.slice(0, 200) + "...";
    return t;
}

function bytesToHex(bytes) {
    return Buffer.from(bytes).toString("hex").toUpperCase();
}

console.log("\n=== 2.1.4 Decryption attempts (try all 3 keys) ===");
for (let item of ciphertextInputs) {
    let cipherBytes;
    try {
        cipherBytes = parseCipherToBytes(item.value);
    } catch (err) {
        console.log(`\n${item.label}: parse error: ${err.message}`);
        continue;
    }

    console.log(`\n${item.label} (bytes=${cipherBytes.length})`);

    let best = { score: -999, text: "", key: "", mode: "", hex: "", bytes: null };
    for (let k of keys) {
        // Mode A: byte-block (matches Q3 encoding if ciphertext was produced by this script)
        let perByte = rsaDecryptBytesPerByte(cipherBytes, k.d, k.n);
        if (perByte) {
            let s = scorePrintableUtf8(perByte);
            let rendered = renderPlaintext(s.bytes);
            console.log(`- ${k.name} / byte-block: score=${s.score.toFixed(2)} text="${summarizeText(rendered.best)}" hex=${bytesToHex(s.bytes)}`);
            let eff = effectiveScore(s.score, s.bytes.length);
            if (eff > best.score) best = { score: eff, text: rendered.best, key: k.name, mode: "byte-block", hex: bytesToHex(s.bytes), bytes: s.bytes };
        } else {
            console.log(`- ${k.name} / byte-block: N/A`);
        }

        // Mode B: interpret ciphertext as one big integer
        try {
            let single = rsaDecryptSingleBigint(cipherBytes, k.d, k.n);
            let s2 = scorePrintableUtf8(single);
            let rendered2 = renderPlaintext(s2.bytes);
            console.log(`- ${k.name} / single-bigint: score=${s2.score.toFixed(2)} text="${summarizeText(rendered2.best)}" hex=${bytesToHex(s2.bytes)}`);
            let eff2 = effectiveScore(s2.score, s2.bytes.length);
            if (eff2 > best.score) best = { score: eff2, text: rendered2.best, key: k.name, mode: "single-bigint", hex: bytesToHex(s2.bytes), bytes: s2.bytes };
        } catch {
            console.log(`- ${k.name} / single-bigint: N/A`);
        }

        // Mode C: decrypt RSA cipher blocks
        let blockPlain = rsaDecryptCipherBlocks(cipherBytes, k.d, k.n);
        if (blockPlain) {
            let s3 = scorePrintableUtf8(blockPlain);
            let rendered3 = renderPlaintext(s3.bytes);
            console.log(`- ${k.name} / cipher-blocks: score=${s3.score.toFixed(2)} text="${summarizeText(rendered3.best)}" hex=${bytesToHex(s3.bytes)}`);
            let eff3 = effectiveScore(s3.score, s3.bytes.length);
            if (eff3 > best.score) best = { score: eff3, text: rendered3.best, key: k.name, mode: "cipher-blocks", hex: bytesToHex(s3.bytes), bytes: s3.bytes };
        } else {
            console.log(`- ${k.name} / cipher-blocks: N/A`);
        }

        // Mode D: cipher blocks -> fixed (blockSize-1) plaintext bytes
        let fixedPlain = rsaDecryptCipherBlocksFixed(cipherBytes, k.d, k.n);
        if (fixedPlain) {
            let s4 = scorePrintableUtf8(fixedPlain);
            let rendered4 = renderPlaintext(s4.bytes);
            console.log(`- ${k.name} / cipher-blocks-fixed: score=${s4.score.toFixed(2)} text="${summarizeText(rendered4.best)}" hex=${bytesToHex(s4.bytes)}`);
            let eff4 = effectiveScore(s4.score, s4.bytes.length);
            if (eff4 > best.score) best = { score: eff4, text: rendered4.best, key: k.name, mode: "cipher-blocks-fixed", hex: bytesToHex(s4.bytes), bytes: s4.bytes };
        } else {
            console.log(`- ${k.name} / cipher-blocks-fixed: N/A`);
        }
    }

    if (best.score < 0) {
        console.log("Best match: (none)");
    } else {
        console.log(`Best match: ${best.key} (${best.mode}), score=${best.score.toFixed(2)} (effective)`);
        console.log(`Plaintext (ascii-safe): ${best.text}`);
        console.log(`Plaintext (hex): ${best.hex}`);
        if (best.bytes && best.bytes.length) {
            console.log(`Plaintext (decimal): ${bytesToBigint(best.bytes)}`);
            const guess = bestEffortTextFromBytes(best.bytes);
            console.log(`Plaintext (text guess): ${summarizeText(guess.text)} (via ${guess.name})`);
        }
    }
}