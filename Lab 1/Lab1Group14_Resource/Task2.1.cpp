#include<iostream>
#include<math.h>

using namespace std;

// Dịch chuyển 1 ký tự theo Caesar cipher (giữ nguyên ký tự không phải chữ).
char shift(char x, int key) {
    if (x >= 'a' && x <= 'z') {
        return char((x - 'a' + key + 26) % 26 + 'a');
    }
    else {
        if (x >= 'A' && x <= 'Z') {
            return char((x - 'A' + key + 26) % 26 + 'A');
        }
        else return x;
    }
}

// Mã hóa Caesar cho cả chuỗi.
string encrypt(string text, int key) {
    string ciphertext = "";
    for (char x: text) {
        ciphertext += shift(x, key);
    }
    return ciphertext;
}

// Giải mã Caesar (tương đương encrypt với -key).
string decrypt(string text, int key) {
    return encrypt(text, -key);
}

// Brute-force Caesar: thử key 0..25.
int main() {
    string plaintext;
    getline(cin, plaintext);

    for (int i = 0 ; i <= 25; ++i) {
        cout << i << ":" << decrypt(plaintext, i) << endl;
    }
}
