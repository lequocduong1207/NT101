#include <iostream>
#include <string>
#include <vector>
#include <limits>

using namespace std;

// Mã hóa Rail Fence (zigzag) theo số rails.
string railFenceEncrypt(const string& text, int rails) {
    if (rails <= 1) return text;

    vector<string> row(rails);
    int r = 0, dir = 1;

    for (char ch : text) {
        row[r].push_back(ch);
        if (r == 0) dir = 1;
        else if (r == rails - 1) dir = -1;
        r += dir;
    }

    string out;
    out.reserve(text.size());
    for (int i = 0; i < rails; i++) out += row[i];
    return out;
}

// Giải mã Rail Fence (đánh dấu zigzag -> điền theo hàng -> đọc zigzag).
string railFenceDecrypt(const string& cipher, int rails) {
    if (rails <= 1) return cipher;
    int n = (int)cipher.size();

    vector<vector<bool>> mark(rails, vector<bool>(n, false));
    int r = 0, dir = 1;
    for (int c = 0; c < n; c++) {
        mark[r][c] = true;
        if (r == 0) dir = 1;
        else if (r == rails - 1) dir = -1;
        r += dir;
    }

    vector<vector<char>> mat(rails, vector<char>(n, '\0'));
    int idx = 0;
    for (int i = 0; i < rails; i++) {
        for (int j = 0; j < n; j++) {
            if (mark[i][j] && idx < n) {
                mat[i][j] = cipher[idx++];
            }
        }
    }

    string plain;
    plain.reserve(n);

    r = 0; dir = 1;
    for (int c = 0; c < n; c++) {
        plain.push_back(mat[r][c]);
        if (r == 0) dir = 1;
        else if (r == rails - 1) dir = -1;
        r += dir;
    }

    return plain;
}

// Main: Encrypt/Decrypt hoặc brute-force rails.
int main() {
    cout << "=== Rail Fence Cipher ===\n";
    cout << "1) Encrypt\n";
    cout << "2) Decrypt\n";
    cout << "3) Brute-force rails (decrypt)\n";
    cout << "Chon (1/2/3): ";

    int mode;
    if (!(cin >> mode)) return 0;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "Nhap text (co the nhieu dong, go END de ket thuc):\n";
    string text, line;
    while (getline(cin, line)) {
        if (line == "END") break;
        if (!text.empty()) text.push_back('\n');
        text += line;
    }

    if (mode == 1) {
        int rails;
        cout << "Nhap so rails: ";
        cin >> rails;

        cout << "\n=== CIPHERTEXT ===\n";
        cout << railFenceEncrypt(text, rails) << "\n";
    }
    else if (mode == 2) {
        int rails;
        cout << "Nhap so rails: ";
        cin >> rails;

        cout << "\n=== PLAINTEXT ===\n";
        cout << railFenceDecrypt(text, rails) << "\n";
    }
    else if (mode == 3) {
        int maxRails;
        cout << "Thu rails toi da (vd 10): ";
        cin >> maxRails;

        cout << "\n=== BRUTE-FORCE RESULTS ===\n";
        for (int r = 2; r <= maxRails; r++) {
            cout << "\n--- rails = " << r << " ---\n";
            cout << railFenceDecrypt(text, r) << "\n";
        }
    }
    else {
        cout << "Che do khong hop le.\n";
    }

    return 0;
}
