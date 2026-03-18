#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <limits>

using namespace std;

struct PlayfairMatrix {
    char grid[5][5];
    pair<int,int> pos[26]; // pos[A..Z], J -> I
};

// Kiểm tra ký tự có phải chữ cái.
static inline bool isLetter(unsigned char c) {
    return std::isalpha(c) != 0;
}

// Chuyển ký tự sang in hoa.
static inline char up(unsigned char c) {
    return (char)std::toupper(c);
}

// ================= NORMALIZE =================
// Chuẩn hóa: chỉ giữ chữ cái, in hoa, gộp J -> I.
string normalizeLettersOnly(const string& s) {
    string out;
    for (unsigned char ch : s) {
        if (isLetter(ch)) {
            char c = up(ch);
            if (c == 'J') c = 'I';
            out.push_back(c);
        }
    }
    return out;
}

// ================= KEY =================
// Tạo khóa 25 ký tự duy nhất cho ma trận Playfair (gộp I/J).
string buildKeyUnique25(const string& key) {
    string k = normalizeLettersOnly(key);

    vector<bool> used(26, false);
    used['J' - 'A'] = true;

    string u;

    for (char c : k) {
        int idx = c - 'A';
        if (!used[idx]) {
            used[idx] = true;
            u.push_back(c);
        }
    }

    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J') continue;
        int idx = c - 'A';
        if (!used[idx]) {
            used[idx] = true;
            u.push_back(c);
        }
    }

    return u; // 25 chars
}

// Tạo ma trận Playfair 5x5 và bảng vị trí ký tự.
PlayfairMatrix createMatrix(const string& key) {
    PlayfairMatrix pm{};
    string u = buildKeyUnique25(key);

    int p = 0;
    for (int r = 0; r < 5; r++) {
        for (int c = 0; c < 5; c++) {
            char ch = u[p++];
            pm.grid[r][c] = ch;
            pm.pos[ch - 'A'] = {r, c};
        }
    }

    // J same as I
    pm.pos['J' - 'A'] = pm.pos['I' - 'A'];
    return pm;
}

// ================= PRINT =================
// In ma trận Playfair 5x5.
void printMatrix(const PlayfairMatrix& pm) {
    cout << "+---+---+---+---+---+\n";
    for (int r = 0; r < 5; r++) {
        cout << "| ";
        for (int c = 0; c < 5; c++) {
            cout << pm.grid[r][c] << " | ";
        }
        cout << "\n+---+---+---+---+---+\n";
    }
}

// In chuỗi theo nhóm 2 ký tự (digraph).
void printGrouped(const string& s) {
    for (int i = 0; i < (int)s.size(); i++) {
        cout << s[i];
        if (i % 2 == 1) cout << ' ';
    }
    cout << '\n';
}

// ================= PREPARE =================
// Chuẩn hóa plaintext và tách thành digraph theo quy tắc Playfair.
string preparePlaintextDigraphs(const string& plaintext, char filler) {
    string t = normalizeLettersOnly(plaintext);
    string out;

    int i = 0;
    while (i < (int)t.size()) {
        char a = t[i];
        char b = (i + 1 < (int)t.size()) ? t[i + 1] : 0;

        if (b == 0) {
            out.push_back(a);
            out.push_back(filler);
            i++;
        } else if (a == b) {
            out.push_back(a);
            out.push_back(filler);
            i++;
        } else {
            out.push_back(a);
            out.push_back(b);
            i += 2;
        }
    }

    if (out.size() % 2 != 0) out.push_back(filler);
    return out;
}

// Chuẩn hóa ciphertext để có độ dài chẵn theo cặp.
string normalizeCipherPairs(const string& ciphertext) {
    string t = normalizeLettersOnly(ciphertext);
    if (t.size() % 2 != 0) t.push_back('X');
    return t;
}

// ================= ENCRYPT =================
// Mã hóa Playfair (đầu ra ciphertext A-Z).
string encryptPlayfair(const PlayfairMatrix& pm, const string& plaintext, char filler, string& preparedOut) {
    preparedOut = preparePlaintextDigraphs(plaintext, filler);
    string out;

    for (int i = 0; i < (int)preparedOut.size(); i += 2) {
        char a = preparedOut[i];
        char b = preparedOut[i + 1];

        auto [r1, c1] = pm.pos[a - 'A'];
        auto [r2, c2] = pm.pos[b - 'A'];

        if (r1 == r2) {
            out.push_back(pm.grid[r1][(c1 + 1) % 5]);
            out.push_back(pm.grid[r2][(c2 + 1) % 5]);
        } else if (c1 == c2) {
            out.push_back(pm.grid[(r1 + 1) % 5][c1]);
            out.push_back(pm.grid[(r2 + 1) % 5][c2]);
        } else {
            out.push_back(pm.grid[r1][c2]);
            out.push_back(pm.grid[r2][c1]);
        }
    }

    return out;
}

// ================= DECRYPT =================
// Giải mã Playfair (trả về plaintext RAW, chưa bỏ filler).
string decryptPlayfairRaw(const PlayfairMatrix& pm, const string& ciphertext, string& normOut) {
    normOut = normalizeCipherPairs(ciphertext);
    string out;

    for (int i = 0; i < (int)normOut.size(); i += 2) {
        char a = normOut[i];
        char b = normOut[i + 1];

        auto [r1, c1] = pm.pos[a - 'A'];
        auto [r2, c2] = pm.pos[b - 'A'];

        if (r1 == r2) {
            out.push_back(pm.grid[r1][(c1 + 4) % 5]);
            out.push_back(pm.grid[r2][(c2 + 4) % 5]);
        } else if (c1 == c2) {
            out.push_back(pm.grid[(r1 + 4) % 5][c1]);
            out.push_back(pm.grid[(r2 + 4) % 5][c2]);
        } else {
            out.push_back(pm.grid[r1][c2]);
            out.push_back(pm.grid[r2][c1]);
        }
    }

    return out;
}

// ================= CLEAN =================
// Hậu xử lý heuristic: bỏ một số 'X' đệm (có thể không hoàn hảo).
string cleanupHeuristic(const string& raw) {
    string out;

    for (int i = 0; i < (int)raw.size(); i++) {
        if (i > 0 && i + 1 < (int)raw.size()) {
            if (raw[i] == 'X' && raw[i - 1] == raw[i + 1]) continue;
        }
        out.push_back(raw[i]);
    }

    if (!out.empty() && out.back() == 'X') out.pop_back();
    return out;
}

// ================= INPUT =================
// Đọc nhiều dòng đến khi gặp END/end.
string readMultilineUntilEND() {
    cout << "Nhap van ban (go END o dong rieng):\n";

    string all, line;
    while (true) {
        if (!getline(cin, line)) break;

        // trim right
        while (!line.empty() && isspace(line.back())) {
            line.pop_back();
        }

        if (line == "END" || line == "end") break;

        if (!all.empty()) all.push_back('\n');
        all += line;
    }

    return all;
}

// ================= MAIN =================
// Main: Playfair Encrypt/Decrypt + in ma trận.
int main() {
    cout << "=== Playfair Cipher ===\n";
    cout << "1) Encrypt\n";
    cout << "2) Decrypt\n";
    cout << "Chon: ";

    int mode;
    cin >> mode;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "Nhap key: ";
    string key;
    getline(cin, key);

    PlayfairMatrix pm = createMatrix(key);

    cout << "\nMatrix:\n";
    printMatrix(pm);

    cout << "\n";
    string text = readMultilineUntilEND();

    if (text.empty()) {
        cout << "Khong co du lieu!\n";
        return 0;
    }

    if (mode == 1) {
        char filler = 'X';
        cout << "Chon filler (X/Q): ";
        cin >> filler;

        string prepared;
        string cipher = encryptPlayfair(pm, text, filler, prepared);

        cout << "\nPlain (digraphs):\n";
        printGrouped(prepared);

        cout << "\nCipher:\n";
        printGrouped(cipher);

    } else if (mode == 2) {
        string norm, raw, clean;

        raw = decryptPlayfairRaw(pm, text, norm);
        clean = cleanupHeuristic(raw);

        cout << "\nCipher normalized:\n";
        printGrouped(norm);

        cout << "\nPlain RAW:\n";
        printGrouped(raw);

        cout << "\nPlain CLEAN:\n";
        printGrouped(clean);

    } else {
        cout << "Sai che do!\n";
    }

    return 0;
}