//
// Created by as on 3/18/2026.
#include <iostream>
#include <string>
#include <cctype>

using namespace std;

// Chuẩn hóa: chỉ giữ chữ cái, chuyển thành in hoa
string cleanText(string text) {
    string result = "";
    for (char c : text) {
        if (isalpha(c)) {
            result += toupper(c);
        }
    }
    return result;
}

// Tạo key lặp lại
string generateKey(string text, string key) {
    key = cleanText(key);
    string newKey = "";
    int keyLen = key.length();

    for (int i = 0; i < text.length(); i++) {
        newKey += key[i % keyLen];
    }
    return newKey;
}

// Mã hóa
string encryptVigenere(string plaintext, string key) {
    plaintext = cleanText(plaintext);
    key = generateKey(plaintext, key);

    string cipher = "";

    for (int i = 0; i < plaintext.length(); i++) {
        int p = plaintext[i] - 'A';
        int k = key[i] - 'A';
        char c = (p + k) % 26 + 'A';
        cipher += c;
    }

    return cipher;
}

// Giải mã
string decryptVigenere(string ciphertext, string key) {
    ciphertext = cleanText(ciphertext);
    key = generateKey(ciphertext, key);

    string plain = "";

    for (int i = 0; i < ciphertext.length(); i++) {
        int c = ciphertext[i] - 'A';
        int k = key[i] - 'A';
        char p = (c - k + 26) % 26 + 'A';
        plain += p;
    }

    return plain;
}

// Main
int main() {
    string text, key;
    char mode;

    cout << "Nhap text: ";
    getline(cin, text);

    cout << "Nhap key: ";
    getline(cin, key);

    cout << "Chon che do (E = Encrypt, D = Decrypt): ";
    cin >> mode;

    if (mode == 'E' || mode == 'e') {
        cout << "Ciphertext: " << encryptVigenere(text, key) << endl;
    } else if (mode == 'D' || mode == 'd') {
        cout << "Plaintext: " << decryptVigenere(text, key) << endl;
    } else {
        cout << "Lua chon khong hop le!" << endl;
    }

    return 0;
}