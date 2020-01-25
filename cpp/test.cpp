#include "bits/stdc++.h"
#include "universal_print_17.h"
using namespace std;

struct example {
    int a;
    string test;
    int array[10];

    declare_struct(a, test, array);
};

int main() {
    for (int i = 0; i < 500000000; ++i) { }
    long long a, b;
    cin >> a >> b;
    //usleep(500000);
    watchblock("testowańsko") {
        watch(a);
        vector<vector<int>> vektorek(100, vector<int> (1, 1337));
        bitset<30> testing;
        int n = 30;
        int tab[n];
        map<int, string> my_map;
        my_map[10] = "test";
        example my_struct;
        my_struct.a = 1337;
        my_struct.test = "siemka";
        watch(my_struct);
        watch(string("se testuje"));
        watch(testing);
        watch(my_map);
        watchblock("testowańsko bardziej") {
            watch(tab);
            watch(vektorek);
        }
    }
    cout << a / b << endl;
    while (a >= b) {
        a -= b;
    }

    cout << a << '\n';
    //usleep(500000);
    //cout.flush();
    //while(true) { };
    /*for(int i = 0; i < 1e2; ++i) {
        cout << i << '\n';
        cout.flush();
        usleep(100000);
    }*/
    return 0;
}
