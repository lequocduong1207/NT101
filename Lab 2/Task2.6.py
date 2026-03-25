# =========================
# 1) KIEM TRA SO NGUYEN TO
# =========================
import random

def kiem_tra_nguyen_to(n, k=8):
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False

    d = n - 1
    r = 0
    while d % 2 == 0:
        d = d // 2
        r += 1

    for i in range(k):
        a = random.randint(2, n - 2)
        x = pow(a, d, n)

        if x == 1 or x == n - 1:
            continue

        check = False
        for j in range(r - 1):
            x = (x * x) % n
            if x == n - 1:
                check = True
                break

        if check == False:
            return False

    return True


def tao_so_nguyen_to(bits):
    while True:
        n = random.getrandbits(bits)
        n = n | (1 << (bits - 1))
        n = n | 1

        if kiem_tra_nguyen_to(n):
            return n


def tim_10_so_nguyen_to_lon_nhat(n):
    ds = []
    x = n - 1

    while x >= 2 and len(ds) < 10:
        if kiem_tra_nguyen_to(x):
            ds.append(x)
        x -= 1

    return ds


print("=== CHUONG TRINH SO NGUYEN TO ===")

p8 = tao_so_nguyen_to(8)
p16 = tao_so_nguyen_to(16)
p64 = tao_so_nguyen_to(64)

print("So nguyen to 8 bit :", p8)
print("So nguyen to 16 bit:", p16)
print("So nguyen to 64 bit:", p64)

mersenne10 = 2**89 - 1
print("\n10 so nguyen to lon nhat nho hon so Mersenne thu 10:")
ds = tim_10_so_nguyen_to_lon_nhat(mersenne10)
for i in range(len(ds)):
    print(i + 1, ":", ds[i])

n = int(input("\nNhap n de kiem tra nguyen to: "))
if kiem_tra_nguyen_to(n):
    print(n, "la so nguyen to")
else:
    print(n, "khong phai la so nguyen to")

# =========================
# 2) TIM GCD
# =========================
def gcd(a, b):
    while b != 0:
        r = a % b
        a = b
        b = r
    return a


print("=== CHUONG TRINH TIM GCD ===")

a = int(input("Nhap a: "))
b = int(input("Nhap b: "))

print("Uoc chung lon nhat cua", a, "va", b, "la:", gcd(a, b))
# =========================
# 3) MODULAR EXPONENTIATION
# =========================
def mod_exp(a, x, p):
    result = 1
    a = a % p

    while x > 0:
        if x % 2 == 1:
            result = (result * a) % p
        a = (a * a) % p
        x = x // 2

    return result


print("=== CHUONG TRINH MODULAR EXPONENTIATION ===")

a = int(input("Nhap a: "))
x = int(input("Nhap x: "))
p = int(input("Nhap p: "))

print(a, "^", x, "mod", p, "=", mod_exp(a, x, p))

print("Vi du: 7^40 mod 19 =", mod_exp(7, 40, 19))
