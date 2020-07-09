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
    for (int i = 0; i < 50000; ++i) { cout << i << ',';}
    long long a, b;
    cin >> a >> b;
    //usleep(500000);
    watchblock("first watchblock") {
        watch(a);
        vector<vector<int>> vector_2d(13, vector<int> (1, 1337));
        bitset<30> testing;
        int n = 30;
        int dynamic_array[n];
        map<int, string> my_map;
        my_map[10] = "test";
        example my_struct;
        my_struct.a = 1337;
        my_struct.test = "some cool value";
        watch(my_struct);
        watch(string("test message"));
        cerr << "test \ntest2";
        watch(testing);
        watchblock("my not long loop") {
            for (int i = 0; i < 10; ++i) {
                watch(i);
            }
        }
        watch(my_map);
        watchblock("2nd watchblock") {
            watch(dynamic_array);
            watch(vector_2d);
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
