/* JSMock by Douglas Meyer
 *
 * Usage:
 *  Math.mock('random', 3/10, 4/10);
 *  Math.random() => 3/10;
 *  Math.random() => 4/10;
 *  Math.random() => actual random;
 */

(function(){
  Object.prototype.mock = function(func){
    if (arguments.length > 2) {
      var index=1, value;
      for (; value=arguments[index]; index++) {
        this.mock(func, value);
      }
    } else {
      var mock = arguments[1];
      var initialFunction = this[func];
      this[func] = function(){
        this[func] = initialFunction;
        if (typeof mock == 'function') {
          return(mock.apply(this, arguments));
        } else {
          return(mock);
        }
      };
    }
    return(this);
  }
})();
