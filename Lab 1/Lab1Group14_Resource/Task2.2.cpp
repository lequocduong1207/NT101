#include <iostream>
#include <map>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

// Frequency analysis: ánh xạ theo thứ tự ETAOIN... để tạo plaintext ước lượng.
string frequencyAnalysis(string cipher) {
    vector<int> freq(26, 0);

    for (char c : cipher) {
        if (isalpha(c)) {
            freq[toupper(c) - 'A']++;
        }
    }

    vector<pair<char, int>> v;
    for (int i = 0; i < 26; i++) {
        v.push_back({'A' + i, freq[i]});
    }

    sort(v.begin(), v.end(), [](auto &a, auto &b) {
        return a.second > b.second;
    });

    string standard = "ETAOINSHRDLCUMWFGYPBVKJXQZ";

    map<char, char> mapping;
    for (int i = 0; i < 26; i++) {
        mapping[v[i].first] = standard[i];
    }

    string result = "";
    for (char c : cipher) {
        if (isalpha(c)) {
            char upper = toupper(c);
            char mapped = mapping[upper];

            if (islower(c))
                mapped = tolower(mapped);

            result += mapped;
        } else {
            result += c;
        }
    }

    return result;
}

// Main: đọc 1 dòng ciphertext.
int main() {
    string ciphertext;
    getline(cin, ciphertext);
}
