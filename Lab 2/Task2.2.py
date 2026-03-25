from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Util import Counter



key = b'1234567890123456'
plaintext = b"UIT_LAB_UIT_LAB_UIT_LAB_UIT_LAB_"


plaintext = pad(plaintext, 16)

cipher_ecb = AES.new(key, AES.MODE_ECB)
ct_ecb = cipher_ecb.encrypt(plaintext)


iv = b'0000000000000000'
cipher_cbc = AES.new(key, AES.MODE_CBC, iv)
ct_cbc = cipher_cbc.encrypt(plaintext)

print("ECB:", ct_ecb.hex())
print("CBC:", ct_cbc.hex())


cipher_cfb = AES.new(key, AES.MODE_CFB, iv)
ct_cfb = cipher_cfb.encrypt(plaintext)
print("CFB:", ct_cfb.hex())
ctr = Counter.new(128)
cipher_ctr = AES.new(key, AES.MODE_CTR, counter=ctr)
ct_ctr = cipher_ctr.encrypt(plaintext)
print("CTR:", ct_ctr.hex())
