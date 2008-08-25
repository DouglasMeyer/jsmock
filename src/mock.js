/* JSMock
 *
 * Usage:
 *  new Mock(Math, 'random', 1);// => <mock object>
 *  Mock.init(); // You need to init to run mock on objects like below
 *  Math.mock('random', 2, 3);// => <Math object>
 *  Math.random();// => 3
 *  Math.random();// => 2
 *  Math.random();// => 1
 *  Math.random();// => actual random
 *
 *  Math.mock('random', 1, 2);// => <Math object>
 *  Mock.reset();// // to clear all mocks
 *  // or: Math.random.reset(); // to just clear the Math.random mock
 *  Math.random();// => actual random
 *
 *  // use this to restore original Mock object (if you had one)
 *  Mock.noFootprint();// => Mock
 *
 * Copyright (c) 2008 Douglas Meyer
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
  var _Mock = window.Mock,
      window_mock = window.mock,
      object_mock = Object.prototype.mock;
  var Mock = window.Mock = function(target, functionName){
    if (arguments.length > 3) {
      var mocks=[];
      for (var index=1, value; value=arguments[index]; index++) {
        mocks.push( new Mock(target, functionName, value) );
      }
      return(mocks);
    } else {
      var originalFunction = target[functionName];
      var mock = arguments[2];
      target[functionName] = function(){
        target[functionName] = originalFunction;
        if (typeof mock == 'function') {
          return(mock.apply(target, arguments));
        } else {
          return(mock);
        }
      };
      this.reset = target[functionName].reset = function(){
        target[functionName] = originalFunction;
        originalFunction.reset && originalFunction.reset();
      };
      Mock.mocks.push(this);
      return(this);
    }
  };
  Mock.mocks = [];
  Mock.reset = function(){
    for (var index=0, mock; mock=this.mocks[index]; index++) {
      mock.reset();
    }
    this.mocks = [];
  };
  Mock.init = function(){
    window.mock = Object.prototype.mock = function(){
      var args=[ this ];
      for(var index=0, arg;arg=arguments[index];index++){
        args.push(arg);
      }
      var mock = Mock.apply(null, args);
      return(this);
    };
  };
  Mock.noFootprint = function(){
    Object.prototype.mock = object_mock;
    window.mock = window_mock;
    window.Mock = _Mock;
    return Mock;
  };

})();
