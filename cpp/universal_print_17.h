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
 *  Last updated:   14.08.2020
 *
 *  Version: 2.1
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
  *                              Support for structs
  * ============================================================================= **/

#define _GET_NTH_ARG(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, N, ...) N

#define _fe_0(_call, ...)
#define _fe_1(_call, member)      _call(member)
#define _fe_2(_call, member, ...) _call(member) _fe_1(_call, __VA_ARGS__)
#define _fe_3(_call, member, ...) _call(member) _fe_2(_call, __VA_ARGS__)
#define _fe_4(_call, member, ...) _call(member) _fe_3(_call, __VA_ARGS__)
#define _fe_5(_call, member, ...) _call(member) _fe_4(_call, __VA_ARGS__)
#define _fe_6(_call, member, ...) _call(member) _fe_5(_call, __VA_ARGS__)
#define _fe_7(_call, member, ...) _call(member) _fe_6(_call, __VA_ARGS__)
#define _fe_8(_call, member, ...) _call(member) _fe_7(_call, __VA_ARGS__)
#define _fe_9(_call, member, ...) _call(member) _fe_8(_call, __VA_ARGS__)
#define _fe_10(_call, member, ...) _call(member) _fe_9(_call, __VA_ARGS__)
#define _fe_11(_call, member, ...) _call(member) _fe_10(_call, __VA_ARGS__)
#define _fe_12(_call, member, ...) _call(member) _fe_11(_call, __VA_ARGS__)
#define _fe_13(_call, member, ...) _call(member) _fe_12(_call, __VA_ARGS__)
#define _fe_14(_call, member, ...) _call(member) _fe_13(_call, __VA_ARGS__)
#define _fe_15(_call, member, ...) _call(member) _fe_14(_call, __VA_ARGS__)
#define _fe_16(_call, member, ...) _call(member) _fe_15(_call, __VA_ARGS__)

#define _CALL_MACRO_FOR_EACH(func, ...) \
    _GET_NTH_ARG("ignored", ##__VA_ARGS__, \
    _fe_16, _fe_15, _fe_14, _fe_13, _fe_12, _fe_11, _fe_10, _fe_9, _fe_8, _fe_7, _fe_6, _fe_5, _fe_4, _fe_3, _fe_2, _fe_1, _fe_0)(func, ##__VA_ARGS__)

#define _PRINT_STRUCT_MEMBER(_member) \
    cupl::print_struct_member(this->_member, #_member);

#define declare_struct(...) \
    void print_process() { \
        _CALL_MACRO_FOR_EACH(_PRINT_STRUCT_MEMBER, ##__VA_ARGS__); \
    }

/** =============================================================================
  *                                 Declarations
  * ============================================================================= **/

#define _CUPL_GET_NUMBER_OF_WATCH_ARGS_(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, N, ...) N

#define  _CUPL_watch_0(...)
#define  _CUPL_watch_1(var, ...) cupl::print_main(var, #var);
#define  _CUPL_watch_2(var, ...) cupl::print_main(var, #var);  _CUPL_watch_1(__VA_ARGS__)
#define  _CUPL_watch_3(var, ...) cupl::print_main(var, #var);  _CUPL_watch_2(__VA_ARGS__)
#define  _CUPL_watch_4(var, ...) cupl::print_main(var, #var);  _CUPL_watch_3(__VA_ARGS__)
#define  _CUPL_watch_5(var, ...) cupl::print_main(var, #var);  _CUPL_watch_4(__VA_ARGS__)
#define  _CUPL_watch_6(var, ...) cupl::print_main(var, #var);  _CUPL_watch_5(__VA_ARGS__)
#define  _CUPL_watch_7(var, ...) cupl::print_main(var, #var);  _CUPL_watch_6(__VA_ARGS__)
#define  _CUPL_watch_8(var, ...) cupl::print_main(var, #var);  _CUPL_watch_7(__VA_ARGS__)
#define  _CUPL_watch_9(var, ...) cupl::print_main(var, #var);  _CUPL_watch_8(__VA_ARGS__)
#define _CUPL_watch_10(var, ...) cupl::print_main(var, #var);  _CUPL_watch_9(__VA_ARGS__)
#define _CUPL_watch_11(var, ...) cupl::print_main(var, #var); _CUPL_watch_10(__VA_ARGS__)
#define _CUPL_watch_12(var, ...) cupl::print_main(var, #var); _CUPL_watch_11(__VA_ARGS__)
#define _CUPL_watch_13(var, ...) cupl::print_main(var, #var); _CUPL_watch_12(__VA_ARGS__)
#define _CUPL_watch_14(var, ...) cupl::print_main(var, #var); _CUPL_watch_13(__VA_ARGS__)
#define _CUPL_watch_15(var, ...) cupl::print_main(var, #var); _CUPL_watch_14(__VA_ARGS__)
#define _CUPL_watch_16(var, ...) cupl::print_main(var, #var); _CUPL_watch_15(__VA_ARGS__)

#define watch(...) \
    { cupl::print_watch_opening_informations(__LINE__); \
    _CUPL_GET_NUMBER_OF_WATCH_ARGS_(ignore, ##__VA_ARGS__, \
    _CUPL_watch_16, _CUPL_watch_15, _CUPL_watch_14, _CUPL_watch_13, _CUPL_watch_12, _CUPL_watch_11, \
    _CUPL_watch_10, _CUPL_watch_9 , _CUPL_watch_8 , _CUPL_watch_7 , _CUPL_watch_6 , _CUPL_watch_5,  \
    _CUPL_watch_4 , _CUPL_watch_3 , _CUPL_watch_2 , _CUPL_watch_1 , _CUPL_watch_0)(__VA_ARGS__); \
    cupl::print_watch_closing_informations(); }
#define watchblock(x) for(int psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z=cupl::watchblock_open(x, __LINE__); psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z; psPDNaVCRHn5ABqHHaXL2vCxw5sgraKSH4GeAcD9D7e5UgTw8Z=cupl::watchblock_close(x))
#define debug if (1)

namespace cupl {

    void print_cds();
    template <typename T, typename... Types>
        void print_cds(T var1, Types... var2);

    struct id_type {
        std::string value;
    };

    id_type id(std::string cds_id);

    const char divisor = 244;

    int cupl_element_id = 1;

    int watchblock_open (std::string name, int line);
    int watchblock_close(std::string name          );

    const char cupl_start = 245;
    const char cupl_end   = 246;
    const char watch_start = 247;
    const char watch_end   = 248;
    const char variable_start = 249;
    const char cds_id_start = 251;
    const char variable_end   = 250;

    const char string_start  = 's';
    const char bitset_start  = 'b';
    const char number_start  = 'n';
    const char pointer_start = '*';

    const char array_start   = 'a';
    const char array_end     = 'A';

    const char pair_start    = 'p';

    const char struct_start  = 'o';
    const char struct_end    = 'O';

    const char watchblock_start  = 242;

    const char watchblock_end = 243;

    template <typename T> using is_iterable = decltype(cupl::detail::is_iterable_impl<T>(0));

    template <typename T           >  void print_main (T x      , int line, std::string name);
    template <typename T, size_t N >  void print_main (T (&x)[N], int line, std::string name);
                                      void print_main(id_type x, std::string name);

    template <typename T> void print_process(T &x);

    // Temporary fix to compilation issues
    template <size_t   S> void print_process(std::bitset<S> &x);
    template <typename U, typename H> void print_process(std::pair<U, H> &x);
    template <typename T> void print_process(std::stack<T> &x);
    template <typename T> void print_process(std::queue<T> &x);
    template <typename T> void print_process(std::priority_queue<T> &x);
    //

    template <typename T, size_t   N > void print_array         (T                    (&x)[N]);
    template <typename T             > void print_iterable      (T                         &x);
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

namespace cupl {

    using namespace std;

    void print_cds() {};
    template <typename T, typename... Types>
    void print_cds(T var1, Types... var2) {
        cerr << var1 << divisor;
        print_cds(var2...);
    }

    id_type id(string cds_id) {
        return { value: cds_id };
    }

    class main_wrapper {
        public:
            main_wrapper() {
                setvbuf(stdout, nullptr, _IOLBF, 0);
                setvbuf(stderr, nullptr, _IOLBF, 0);
                //print_cds(cupl_start);
                watchblock_open("main", 0);
            };

            ~main_wrapper() {
            //print_cds(cupl_end, '\n');
                watchblock_close("main");
            };
    };

    main_wrapper wrapper;

    int watchblock_open(string name, int line) {
        print_cds(cupl_start,watchblock_start, cupl_element_id++, name, line,cupl_end);
        cerr<<endl;
        return 1;
    }

    int watchblock_close(string name){
        print_cds(cupl_start, watchblock_end, cupl_end);
        cerr<<endl;
    }

    void print_watch_opening_informations(int line){
        print_cds(cupl_start, watch_start, cupl_element_id++, line, "config");
    }

    void print_watch_closing_informations(){
        print_cds(watch_end, cupl_end);
        cerr<<endl;
    }

    void print_main(id_type x, string name){
        print_cds(cds_id_start, x.value); //flush
    }

    template <typename T>
    void print_main(T x, string name){
        print_cds(variable_start, name, type_name<T>()); //flush
        print_process(x);
        //print_cds(variable_end); //flush
    }

    template <typename T, size_t N>
    void print_main(T (&x)[N], string name) {
        print_cds(variable_start, name, type_name<T>()); //flush
        print_array(x);
        //print_cds(variable_end); //flush
    }

    template <typename T>
    void print_process(T &x){
             if constexpr(is_arithmetic_v <T                     >       ) print_arithmetic    (x);
        else if constexpr(is_pointer_v    <T                     >       ) print_pointer       (x);
        else if constexpr(is_same         <T,string              >::value) print_string        (x);
        /*
        else if constexpr(is_same         <T,bitset        <S  > >::value) print_bitset        (x);
        else if constexpr(is_same         <T,pair          <U,H> >::value) print_pair          (x);
        else if constexpr(is_same         <T,stack         <U  > >::value) print_stack         (x);
        else if constexpr(is_same         <T,queue         <U  > >::value) print_queue         (x);
        else if constexpr(is_same         <T,priority_queue<U  > >::value) print_priority_queue(x);
        */
        else if constexpr(is_iterable     <T                     >::value) print_iterable      (x);
        else if constexpr(is_class_v      <T> && !(is_iterable<T>::value)) print_class_struct  (x);
    }

    // Temporary fix to compilation issues
    template <size_t S>
    void print_process(bitset<S> &x) {
        print_bitset(x);
    }

    template <typename U, typename H>
    void print_process(pair<U, H> &x) {
        print_pair(x);
    }

    template <typename T>
    void print_process(stack<T> &x) {
        print_stack(x);
    }

    template <typename T>
    void print_process(queue<T> &x) {
        print_queue(x);
    }

    template <typename T>
    void print_process(priority_queue<T> &x) {
        print_priority_queue(x);
    }
    //

    template <typename T, size_t N>
    void print_array(T (&a)[N]){
        print_cds(array_start);
        for(int i = 0; i < (int)N; ++i) {
            print_process(a[i]);
        }
        print_cds(array_end);
    }

    template <typename T>
    void print_iterable(T &x){
        print_cds(array_start);
        for (auto e: x) {
            print_process(e);
        }
        print_cds(array_end);
    }

    template <typename T>
    void print_arithmetic(T &x) {
        print_cds(number_start, x);
    }

    template <size_t T>
    void print_bitset(bitset<T> &x) {
        print_cds(bitset_start, x);
    }

    template <typename T>
    void print_class_struct(T &x) {
        x.print_process();
    }

    template <typename T>
    void print_struct_member(T &x, string member_name) {
        print_string(member_name);
        print_process(x);
    }

    template <typename T>
    void print_pointer(T &x) {
        string nullptrVar = "nullptr";
        print_cds(pointer_start);
        if (x != nullptr)
            print_process(*x);
        else
            print_string(nullptrVar);
    }

    void print_string(string &x) {
        print_cds(string_start, x);
    }

    template <typename U, typename H>
    void print_pair(pair<U, H> &x) {
        print_cds(pair_start);
        print_process(x.first);
        print_process(x.second);
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
