/* ==============================================================================
 *
 *  Contributors:
 *
 *      Name:       Kajetan Lewandowski
 *      Nickname:   LegwanXDL
 *
 *      Name:       Adam Jeli�ski
 *      Nickname:   charodziej
 *
 *  Description:    A library for Competitive Debugging System
 *
 *  Created:        22.12.2019
 *  Last updated:   22.12.2019
 *
 *  Version: 1.0
 *
 *  universal-print-in-cpp-for-cds
 *  Universal print in C++ for Competitive Debugging System
 *
 *  g++ -std=c++17 -o template.o template.cpp
 *  ./template.o
 *
 * ============================================================================== */

/** =============================================================================
  *                                     Libraries
  * ============================================================================= **/

#define TODO /**/
#include <iostream>
#include <queue>
#include <stack>
#include <bitset>
#include <memory>
#include <sstream>
#include <cxxabi.h>

namespace cupl {

    namespace detail {
        using std::begin;
        using std::end;
        template <typename T>
        auto is_iterable_impl(int)
        -> decltype (
            begin(std::declval<T&>()) != end(std::declval<T&>()),   // begin/end and operator !=
            void(),                                                 // Handle evil operator ,
            ++std::declval<decltype(begin(std::declval<T&>()))&>(), // operator ++
            void(*begin(std::declval<T&>())),                       // operator*
            std::true_type {});

        template <typename T>
        std::false_type is_iterable_impl(...);
    }

    template <class T> std::string type_name() {
        typedef typename std::remove_reference<T>::type TR;
        std::unique_ptr<char, void(*)(void*)> own
        (
            abi::__cxa_demangle(typeid(TR).name(), nullptr, nullptr, nullptr),
            std::free
        );
        std::string r = own != nullptr ? own.get() : typeid(TR).name();
        if (std::is_const<TR>::value)
            r += " const";
        if (std::is_volatile<TR>::value)
            r += " volatile";
        if (std::is_lvalue_reference<T>::value)
            r += "&";
        else if (std::is_rvalue_reference<T>::value)
            r += "&&";
        return r;
    }
}

/** =============================================================================
  *                                 Declarations
  * ============================================================================= **/

#define watch(x, ...) cupl::print_main(x, __LINE__, #x);
#define watchblock(x) for(int psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z=cupl::watchblock_open(x, __LINE__, cupl::watchblock_id); psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z; psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z=cupl::watchblock_close(cupl::watchblock_id))
#define debug if (1)

namespace cupl{

    int watchblock_id = 1;

    int watchblock_open (std::string name, int line);
    int watchblock_close(std::string name          );

    const std::string variable_start = {(char)230};
    const std::string variable_end   = {(char)231};

    const std::string array_start   = {(char)225};
    const std::string array_end     = {(char)227};
    const std::string array_divisor = {(char)226};

    const std::string pair_start    = {(char)240};
    const std::string pair_end      = {(char)241};
    const std::string pair_divisor  = {(char)242};

    const std::string watchblock_open_start   = {(char)200,(char)201,(char)200};
    const std::string watchblock_open_divisor = {(char)199                    };
    const std::string watchblock_open_end     = {(char)198                    };

    const std::string watch_start             = {(char)210,(char)211,(char)210};
    const std::string watch_divisor           = {(char)213                    };
    const std::string watch_end               = {(char)212                    };

    const std::string watchblock_close_start  = {(char)180,(char)181,(char)180};
    const std::string watchblock_close_end    = {(char)182                    };

    template <typename T> using is_iterable = decltype(cupl::detail::is_iterable_impl<T>(0));

    template<typename T           >  void print_main (T x      , int line, std::string name);
    template<typename T, size_t N >  void print_main (T (&x)[N], int line, std::string name);

    template<typename T, typename U = int, typename H = int ,size_t S = 10> void print_process(T &x);

    template <typename T, size_t   N > void print_array         (T                    (&x)[N]);
    template <typename T             > void print_arithmetic    (T                         &x);
    template <typename T             > void print_class_struct  (T                         &x);
    template <typename T             > void print_pointer       (T                         &x);
    template <typename U, typename H > void print_pair          (std::pair          <U, H> &x);
    template <typename T             > void print_stack         (std::stack         <T   > &x);
    template <typename T             > void print_queue         (std::queue         <T   > &x);
    template <typename T             > void print_priority_queue(std::priority_queue<T   > &x);
    template <size_t   T             > void print_bitset        (std::bitset        <T   > &x);
                                       void print_string        (std::string               &x);
}

/** =============================================================================
  *                                 Definitions
  * ============================================================================= **/

namespace cupl{

    using namespace std;

    int watchblock_open(string name, int line, int id){
        ++watchblock_id;
        cout << watchblock_open_start << to_string(id) << watchblock_open_divisor << name << watchblock_open_divisor << to_string(line) << watchblock_open_end;
        return 1;
    }
    int watchblock_close(int id){
        cout << watchblock_close_start << to_string(id) << watchblock_close_end;
        return 0;
    }

    template<typename T>
    void print_main(T x, int line, string name){
        cout << watch_start << name << watch_divisor << type_name<T>() << watch_divisor << to_string(line) << watch_divisor << "config" << watch_divisor;
        print_process(x);
        cout << watch_end;
    }

    template<typename T, size_t N>
    void print_main(T (&x)[N],  int line, string name) {
        cout << watch_start << name << watch_divisor << type_name<T>() << watch_divisor << to_string(line) << watch_divisor << "config" << watch_divisor;
        print_process(x);
        cout << watch_end;
    }

    template<typename T,typename U = int, typename H = int,size_t S = 10>
    void print_process(T &x){
             if constexpr(is_arithmetic_v <T                     >       ) print_arithmetic    (x);
        else if constexpr(is_class_v      <T> && !(is_iterable<T>::value)) print_class_struct  (x);
        else if constexpr(is_pointer_v    <T                     >       ) print_pointer       (x);
        else if constexpr(is_same         <T,bitset        <S  > >::value) print_bitset        (x);
        else if constexpr(is_same         <T,string              >::value) print_string        (x);
        else if constexpr(is_same         <T,pair          <U,H> >::value) print_pair          (x);
        else if constexpr(is_same         <T,stack         <U  > >::value) print_stack         (x);
        else if constexpr(is_same         <T,queue         <U  > >::value) print_queue         (x);
        else if constexpr(is_same         <T,priority_queue<U  > >::value) print_priority_queue(x);
        else if constexpr(is_iterable     <T                     >::value) print_array         (x);
    }

    template<typename T,size_t N>
    void print_array(T (&a)[N]){
        cout << array_start;
        for(int i=0; i<(int)N; ++i) {
            print_process(a[i]);
            cout << array_divisor;
        }
        cout << array_end;
    }

    template <typename T>
    void print_arithmetic(T &x) {
        cout << variable_start << x << variable_end;
    }

    template <size_t T>
    void print_bitset(bitset<T> &x) {
        cout << variable_start << x << variable_end;
    }

    template <typename T>
    void print_class_struct(T &x) {
        x.print_process();
    }

    template <typename T>
    void print_pointer(T &x) {
        if (x != nullptr)
            print_process(*x);
        else
            cout << "nullptr";
    }

    void print_string(string &x) {
        cout << variable_start << x << variable_end;
    }

    template <typename U, typename H>
    void print_pair(pair<U, H> &x) {
        cout << pair_start;
        print_process(x.first);
        cout << pair_divisor;
        print_process(x.second);
        cout << pair_end;
    }

    template <typename T>
    void print_stack(stack<T> &x) {
        stack<T>  tmp = x;
        vector<T> result;
        while (!tmp.empty()) {
            result.push_back(tmp.top());
            tmp.pop();
        }
        print_process(result);
    }

    template <typename T>
    void print_queue(queue<T> &x) {
        queue<T>  tmp = x;
        vector<T> result;
        while (!tmp.empty()) {
            result.push_back(tmp.front());
            tmp.pop();
        }
        print_process(result);
    }

    template <typename T>
    void print_priority_queue(priority_queue<T> &x) {
        priority_queue<T> tmp = x;
        vector<T> result;
        while (!tmp.empty()) {
            result.push_back(tmp.top());
            tmp.pop();
        }
        print_process(result);
    }
}
