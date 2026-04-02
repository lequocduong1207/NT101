code = r'''
import hashlib

def read_modulus(modulus_file):
    with open(modulus_file, "r", encoding="utf-8") as f:
        data = f.read().strip()

    if data.startswith("Modulus="):
        data = data[len("Modulus="):]

    data = data.replace("\n", "").replace(" ", "")
    return int(data, 16)


def read_signature(signature_file):
    with open(signature_file, "r", encoding="utf-8") as f:
        data = f.read().strip()

    data = data.replace("\n", "").replace(" ", "").replace(":", "")
    return int(data, 16)


def read_binary_file(filename):
    with open(filename, "rb") as f:
        return f.read()


def sha256_hash(data):
    return hashlib.sha256(data).digest()


def rsa_verify(signature_int, e, n):
    return pow(signature_int, e, n)


def int_to_bytes(value, length):
    return value.to_bytes(length, byteorder="big")


def parse_pkcs1_v15_sha256(encoded_message):
    if len(encoded_message) < 11:
        return None, "Encoded message quá ngắn"

    if encoded_message[0] != 0x00 or encoded_message[1] != 0x01:
        return None, "Sai header PKCS#1 v1.5"

    idx = 2
    while idx < len(encoded_message) and encoded_message[idx] == 0xFF:
        idx += 1

    if idx >= len(encoded_message) or encoded_message[idx] != 0x00:
        return None, "Không tìm thấy byte 00 sau padding"

    digest_info = encoded_message[idx + 1:]

    sha256_prefix = bytes.fromhex("3031300d060960864801650304020105000420")

    if not digest_info.startswith(sha256_prefix):
        return None, "DigestInfo không đúng định dạng SHA-256"

    digest = digest_info[len(sha256_prefix):]

    if len(digest) != 32:
        return None, "Độ dài hash SHA-256 không hợp lệ"

    return digest, None


def verify_certificate(ca_modulus_file, exponent, signature_file, body_file):
    n = read_modulus(ca_modulus_file)
    e = exponent
    signature_int = read_signature(signature_file)
    body = read_binary_file(body_file)

    computed_hash = sha256_hash(body)

    decoded_int = rsa_verify(signature_int, e, n)

    k = (n.bit_length() + 7) // 8
    decoded_bytes = int_to_bytes(decoded_int, k)

    extracted_hash, error = parse_pkcs1_v15_sha256(decoded_bytes)

    print("===== THONG TIN XAC MINH =====")
    print("Public exponent e =", e)
    print("Do dai modulus n =", n.bit_length(), "bits")
    print("SHA-256(body)    =", computed_hash.hex())

    if error is not None:
        print("Loi khi phan tich chu ky:", error)
        print("Encoded message =", decoded_bytes.hex())
        return False

    print("Hash tu chu ky   =", extracted_hash.hex())

    if computed_hash == extracted_hash:
        print("KET LUAN: Chung chi HOP LE")
        return True
    else:
        print("KET LUAN: Chung chi KHONG HOP LE")
        return False


if __name__ == "__main__":
    verify_certificate("ca_modulus.txt", 65537, "sig_hex.txt", "c0_body.bin")
'''

with open("verify_cert.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Da tao verify_cert.py")
