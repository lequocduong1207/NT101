#include<iostream>
#include<math.h>

using namespace std;

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

string encrypt(string text, int key) {
    string ciphertext = "";
    for (char x: text) {
        ciphertext += shift(x, key);
    }
    return ciphertext;
}

string decrypt(string text, int key) {
    return encrypt(text, -key);
}

int main() {
    string plaintext;
    getline(cin, plaintext);

    for (int i = 0 ; i <= 25; ++i) {
        cout << i << ":" << decrypt(plaintext, i) << endl;
    }
}
