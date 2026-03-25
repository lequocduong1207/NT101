from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Util import Counter

key = b'1234567890123456'
iv = b'0000000000000000'
data = b'A' * 1000
data = pad(data, 16)
def flip_bit(data, byte_index, bit_index):
    data = bytearray(data)
    data[byte_index] ^= (1 << bit_index)
    return bytes(data)
def test_mode(mode_name, mode):


    if mode_name in ["CBC", "CFB", "OFB"]:
        cipher = AES.new(key, mode, iv=iv)
    elif mode_name == "CTR":
        ctr = Counter.new(128)
        cipher = AES.new(key, mode, counter=ctr)
    else:
        cipher = AES.new(key, mode)

    ciphertext = cipher.encrypt(data)

   
    corrupted = flip_bit(ciphertext, 25, 0)

  
    if mode_name in ["CBC", "CFB", "OFB"]:
        cipher_dec = AES.new(key, mode, iv=iv)
    elif mode_name == "CTR":
        ctr = Counter.new(128)
        cipher_dec = AES.new(key, mode, counter=ctr)
    else:
        cipher_dec = AES.new(key, mode)

    decrypted = cipher_dec.decrypt(corrupted)


    error_blocks = 0
    for i in range(0, len(data), 16):
        if decrypted[i:i+16] != data[i:i+16]:
            error_blocks += 1

    print(f"{mode_name}: lỗi {error_blocks} block")



test_mode("ECB", AES.MODE_ECB)
test_mode("CBC", AES.MODE_CBC)
test_mode("CFB", AES.MODE_CFB)
test_mode("OFB", AES.MODE_OFB)
test_mode("CTR", AES.MODE_CTR)