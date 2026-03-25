from Crypto.Cipher import DES

# Hàm chuyển đổi dữ liệu thành chuỗi nhị phân 64 bit
def to_binary_string(data: bytes) -> str:
    return bin(int.from_bytes(data, byteorder='big'))[2:].zfill(64)

# Hàm tính khoảng cách Hamming giữa hai chuỗi nhị phân
def hamming_distance(b1: str, b2: str) -> int:
    return sum(el1 != el2 for el1, el2 in zip(b1, b2))

def avalanche_test(key: bytes):
    p1 = b'STAYHOME'
    p2 = b'STAYHOMA' # Chỉ khác 1 ký tự cuối so với p1
# TODO: Thực hiện mã hóa p1, p2 bằng DES-ECB
    cipher = DES.new(key, DES.MODE_ECB)
    c1 = cipher.encrypt(p1)
    c2 = cipher.encrypt(p2)
    b1 = to_binary_string(c1)
    b2 = to_binary_string(c2)

# TODO: Đếm số bit khác nhau giữa hai bản mã thu được
    hd = hamming_distance(b1, b2)
# TODO: Tính tỷ lệ % bit bị thay đổi
    percentage = (hd / len(b1)) * 100
    return hd, percentage

# Danh sách khóa là MSSV thành viên trong nhóm
ds_mssv = ['24520358', '24520365', '24521250']

for mssv in ds_mssv:
    key = mssv.encode()[:8]  # Lấy 8 byte đầu tiên làm key
    hd, percentage = avalanche_test(key)
    print(f"Testing MSSV: {mssv}", f", Hamming Distance: {hd}", f", Percentage of bits changed: {percentage:.2f}%")
