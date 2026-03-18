#include <iostream>
#include <map>
#include <string>
#include <cctype>
using namespace std;

char matrix[5][5];
map<char, pair<int,int>> pos;

// Tạo ma trận
void generateMatrix(string key) {
    string used = "";

    for (char c : key) {
        if (isalpha(c)) {
            c = toupper(c);
            if (c == 'J') c = 'I';

            if (used.find(c) == string::npos) {
                used += c;
            }
        }
    }

    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J') continue;
        if (used.find(c) == string::npos) {
            used += c;
        }
    }

    int k = 0;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            matrix[i][j] = used[k];
            pos[used[k]] = {i, j};
            k++;
        }
    }
}

// In ma trận
void printMatrix() {
    cout << "\nMatrix:\n";
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
}

// Chuẩn hóa plaintext (FIX thông minh)
string prepareText(string text) {
    string res = "";

    // bước 1: clean
    for (char c : text) {
        if (isalpha(c)) {
            c = toupper(c);
            if (c == 'J') c = 'I';
            res += c;
        }
    }

    string result = "";

    // bước 2: xử lý cặp
    for (int i = 0; i < res.length(); i++) {
        result += res[i];

        if (i + 1 < res.length() && res[i] == res[i + 1]) {
            // nếu trùng → thêm filler khác X nếu cần
            if (res[i] == 'X') result += 'Q';
            else result += 'X';
        }
    }

    // bước 3: nếu lẻ
    if (result.length() % 2 != 0) {
        if (result.back() == 'X') result += 'Y';
        else result += 'X';
    }

    return result;
}

// Chuẩn hóa ciphertext
string cleanCipher(string text) {
    string res = "";
    for (char c : text) {
        if (isalpha(c)) {
            c = toupper(c);
            if (c == 'J') c = 'I';
            res += c;
        }
    }
    return res;
}

// Encrypt
string encrypt(string text) {
    string res = "";

    for (int i = 0; i < text.length(); i += 2) {
        char a = text[i], b = text[i + 1];
        auto p1 = pos[a];
        auto p2 = pos[b];

        if (p1.first == p2.first) {
            res += matrix[p1.first][(p1.second + 1) % 5];
            res += matrix[p2.first][(p2.second + 1) % 5];
        }
        else if (p1.second == p2.second) {
            res += matrix[(p1.first + 1) % 5][p1.second];
            res += matrix[(p2.first + 1) % 5][p2.second];
        }
        else {
            res += matrix[p1.first][p2.second];
            res += matrix[p2.first][p1.second];
        }
    }

    return res;
}

// Decrypt
string decrypt(string text) {
    string res = "";

    for (int i = 0; i < text.length(); i += 2) {
        char a = text[i], b = text[i + 1];
        auto p1 = pos[a];
        auto p2 = pos[b];

        if (p1.first == p2.first) {
            res += matrix[p1.first][(p1.second + 4) % 5];
            res += matrix[p2.first][(p2.second + 4) % 5];
        }
        else if (p1.second == p2.second) {
            res += matrix[(p1.first + 4) % 5][p1.second];
            res += matrix[(p2.first + 4) % 5][p2.second];
        }
        else {
            res += matrix[p1.first][p2.second];
            res += matrix[p2.first][p1.second];
        }
    }

    return res;
}

int main() {
    string key, text;
    char mode;

    cout << "Nhap key: ";
    getline(cin, key);

    generateMatrix(key);
    printMatrix();

    cout << "\nNhap text: ";
    getline(cin, text);

    cout << "Chon (E/D): ";
    cin >> mode;

    if (mode == 'E' || mode == 'e') {
        string prepared = prepareText(text);
        cout << "\nPrepared: " << prepared << endl;
        cout << "Cipher: " << encrypt(prepared) << endl;
    }
    else if (mode == 'D' || mode == 'd') {
        string cleaned = cleanCipher(text);
        cout << "Plain: " << decrypt(cleaned) << endl;
    }
    else {
        cout << "Lua chon sai!\n";
    }

    return 0;
}