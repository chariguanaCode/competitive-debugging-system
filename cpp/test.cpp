#include <iostream>
#include "universal_print_17.h"
using namespace std;
int main() {
    for (int i = 0; i < 500000000; ++i) { }
    long long a, b;
    cin >> a >> b;
    //usleep(500000);
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
