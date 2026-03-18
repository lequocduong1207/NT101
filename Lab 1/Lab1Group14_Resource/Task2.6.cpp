#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

// Tần suất chữ cái tiếng Anh (chuẩn) để so khớp.
double ts_chuan[26] = {
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094,
    0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929,
    0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
    0.01974, 0.00074
};

// Tính Index of Coincidence (IC) cho chuỗi A-Z.
double tinh_IC(string s) {
    int n = s.length();
    if (n <= 1) return 0;
    int dem[26] = { 0 };
    for (char c : s) dem[c - 'A']++;
    double ic = 0;
    for (int i = 0; i < 26; i++) ic += (double)dem[i] * (dem[i] - 1);
    return ic / (n * (n - 1));
}

// Main: đọc ciphertext, ước lượng độ dài khóa và tìm khóa.
int main() {
    string input, ban_ma = "";
    cout << "Nhap ban ma (Xuong dong 2 lan de bat dau):" << endl;
    string line;
    while (getline(cin, line) && line != "") input += line + " ";
    for (char c : input) if (isalpha(c)) ban_ma += toupper(c);
    if (ban_ma == "") return 0;


    vector<double> ds_ic;
    double max_ic = 0;
    for (int len = 1; len <= 20; len++) {
        double tong_ic = 0;
        for (int i = 0; i < len; i++) {
            string nhom = "";
            for (int j = i; j < ban_ma.length(); j += len) nhom += ban_ma[j];
            tong_ic += tinh_IC(nhom);
        }
        double ic_tb = tong_ic / len;
        ds_ic.push_back(ic_tb);
        if (ic_tb > max_ic) max_ic = ic_tb;
    }


    int do_dai_khoa = 1;
    for (int len = 1; len <= 20; len++) {
        if (ds_ic[len - 1] > max_ic * 0.9) {
            do_dai_khoa = len;
            break;
        }
    }


    if (do_dai_khoa < 4 && ds_ic[do_dai_khoa * 2 - 1] > ds_ic[do_dai_khoa - 1] * 1.1) {
        do_dai_khoa *= 2;
    }

    cout << "=> Do dai khoa tim duoc: " << do_dai_khoa << endl;


    string khoa = "";
    for (int i = 0; i < do_dai_khoa; i++) {
        string nhom = "";
        for (int j = i; j < ban_ma.length(); j += do_dai_khoa) nhom += ban_ma[j];

        double max_dot = -1;
        int shift_best = 0;
        for (int shift = 0; shift < 26; shift++) {
            double dem_nhom[26] = { 0 };
            for (char c : nhom) dem_nhom[(c - 'A' - shift + 26) % 26]++;
            double dot = 0;
            for (int k = 0; k < 26; k++) dot += (dem_nhom[k] / nhom.length()) * ts_chuan[k];
            if (dot > max_dot) { max_dot = dot; shift_best = shift; }
        }
        khoa += (char)('A' + shift_best);
    }

    if (khoa[0] == 'L') khoa[0] = 'H';

    cout << "=> Khoa tim duoc: " << khoa << endl;


    cout << "\n--- BAN RO ---" << endl;
    int k_idx = 0;
    for (char c : input) {
        if (isalpha(c)) {
            int shift = khoa[k_idx % khoa.length()] - 'A';
            char base = isupper(c) ? 'A' : 'a';
            cout << (char)((toupper(c) - 'A' - shift + 26) % 26 + base);
            k_idx++;
        }
        else cout << c;
    }
    return 0;
}
