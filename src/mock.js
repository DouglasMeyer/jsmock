/* JSMock
 *
 * Usage:
 *  Math.mock('random', 3/10, 4/10);
 *  Math.random(); => 4/10
 *  Math.random(); => 3/10
 *  Math.random(); => actual random
 *
 *  Math.mock('random', 1, 2);
 *  Mock.clear();
 *  Math.random(); => actual random
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
  var toArray = function(){
    var newArray=[];
    for(var argIndex=0, arg; arg=arguments[argIndex]; argIndex++){
      for(var index=0, obj; obj=arg[index]; index++){
        newArray.push(obj);
      }
    }
    return(newArray);
  };
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

  Object.prototype.mock = function(){
    var argu=[ this ];
    for(var index=0, arg;arg=arguments[index];index++){
      argu.push(arg);
    }
    var mock = Mock.apply(null, argu);
    mock.prototype = Mock.prototype;
    return(this);
  };
  Object.prototype.mock.clear = function(){
  };
})();
