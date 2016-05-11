/**
 * Created by tylevine on 8/6/14.
 */

var backend = (function(){

    // change these values if necessary
//    var backendIP = "10.194.132.110";
    var fun;
    var backendIP = location.hostname;
    var backendScheme = location.protocol;
    console.log (backendScheme);
    var backendPort = '8020';
    var backendPath = '/pathman_sr';
//    var odlUser = 'admin';
//    var odlPass = 'admin';

    fun = function () {
        var odlUser = 'admin';
        var odlPass = 'admin';
        console.log(odlUser);
        console.log(odlPass);
//        console.log (window.parent.window.sessionStorage);
//        return backendScheme + '//' + window.parent.window.sessionStorage + ":" + window.parent.window.sessionStorage + "@" + backendIP + backendPath;
//        return backendScheme + '//' + odlUser + ':' + odlPass @ backendIP + backendPath;
//        return backendScheme + '//' + backendIP + ':' + backendPort + backendPath;
//          * chris metz adjustment to create return http://localhost:8020/pathman_sr from the backend function
        return backendScheme + '//' + backendIP + ':' + backendPort + backendPath;
    };

    console.log("backend url: " + fun());
    return fun;
//    console.log(fun());

//   return function() {
//        return backendScheme + '//' + backendIP + ':' + backendPort + backendPath;
//        return backendScheme + '//' + window.parent.window.sessionStorage.odlUser + ":"+window.parent.window.sessionStorage.odlPass +"@"+ backendIP + backendPath;
    }
());
