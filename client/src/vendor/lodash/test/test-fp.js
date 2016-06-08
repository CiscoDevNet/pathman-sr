;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the size to cover large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as a reference to the global object. */
  var root = (typeof global == 'object' && global) || this;

  /** Used for native method references. */
  var arrayProto = Array.prototype;

  /** Method and object shortcuts. */
  var phantom = root.phantom,
      argv = root.process && process.argv,
      document = !phantom && root.document,
      slice = arrayProto.slice,
      WeakMap = root.WeakMap;

  // Leak to avoid sporadic `noglobals` fails on Edge in Sauce Labs.
  root.msWDfn = undefined;

  /*--------------------------------------------------------------------------*/

  /** Load QUnit and extras. */
  var QUnit = root.QUnit || require('qunit-extras');

  /** Load stable Lodash. */
  var _ = root._ || (
    _ = require('../lodash.js'),
    _.runInContext(root)
  );

  var convert = (function() {
    var baseConvert = root.fp || require('../fp/_baseConvert.js');
    if (!root.fp) {
      return function(name, func, options) {
        return baseConvert(_, name, func, options);
      };
    }
    return function(name, func, options) {
      if (typeof name == 'function') {
        options = func;
        func = name;
        name = undefined;
      }
      return name === undefined
        ? baseConvert(func, options)
        : baseConvert(_.runInContext(), options)[name];
    };
  }());

  var allFalseOptions = {
    'cap': false,
    'curry': false,
    'fixed': false,
    'immutable': false,
    'rearg': false
  };

  var fp = root.fp
    ? (fp = _.noConflict(), _ = root._, fp)
    : convert(_.runInContext());

  var mapping = root.mapping || require('../fp/_mapping.js');

  /*--------------------------------------------------------------------------*/

  /**
   * Skips a given number of tests with a passing result.
   *
   * @private
   * @param {Object} assert The QUnit assert object.
   * @param {number} [count=1] The number of tests to skip.
   */
  function skipAssert(assert, count) {
    count || (count = 1);
    while (count--) {
      assert.ok(true, 'test skipped');
    }
  }

  /*--------------------------------------------------------------------------*/

  if (argv) {
    console.log('Running lodash/fp tests.');
  }

  QUnit.module('convert module');

  (function() {
    QUnit.test('should work with `name` and `func`', function(assert) {
      assert.expect(2);

      var array = [1, 2, 3, 4],
          remove = convert('remove', _.remove);

      var actual = remove(function(n) {
        return n % 2 == 0;
      })(array);

      assert.deepEqual(array, [1, 2, 3, 4]);
      assert.deepEqual(actual, [1, 3]);
    });

    QUnit.test('should work with `name`, `func`, and `options`', function(assert) {
      assert.expect(3);

      var array = [1, 2, 3, 4],
          remove = convert('remove', _.remove, allFalseOptions);

      var actual = remove(array, function(n, index) {
        return index % 2 == 0;
      });

      assert.deepEqual(array, [2, 4]);
      assert.deepEqual(actual, [1, 3]);
      assert.deepEqual(remove(), []);
    });

    QUnit.test('should work with an object', function(assert) {
      assert.expect(2);

      if (!document) {
        var array = [1, 2, 3, 4],
            lodash = convert({ 'remove': _.remove });

        var actual = lodash.remove(function(n) {
          return n % 2 == 0;
        })(array);

        assert.deepEqual(array, [1, 2, 3, 4]);
        assert.deepEqual(actual, [1, 3]);
      }
      else {
        skipAssert(assert, 2);
      }
    });

    QUnit.test('should work with an object and `options`', function(assert) {
      assert.expect(3);

      if (!document) {
        var array = [1, 2, 3, 4],
            lodash = convert({ 'remove': _.remove }, allFalseOptions);

        var actual = lodash.remove(array, function(n, index) {
          return index % 2 == 0;
        });

        assert.deepEqual(array, [2, 4]);
        assert.deepEqual(actual, [1, 3]);
        assert.deepEqual(lodash.remove(), []);
      }
      else {
        skipAssert(assert, 3);
      }
    });

    QUnit.test('should work with lodash and `options`', function(assert) {
      assert.expect(3);

      var array = [1, 2, 3, 4],
          lodash = convert(_.runInContext(), allFalseOptions);

      var actual = lodash.remove(array, function(n, index) {
        return index % 2 == 0;
      });

      assert.deepEqual(array, [2, 4]);
      assert.deepEqual(actual, [1, 3]);
      assert.deepEqual(lodash.remove(), []);
    });

    QUnit.test('should work with `runInContext` and `options`', function(assert) {
      assert.expect(3);

      var array = [1, 2, 3, 4],
          runInContext = convert('runInContext', _.runInContext, allFalseOptions),
          lodash = runInContext();

      var actual = lodash.remove(array, function(n, index) {
        return index % 2 == 0;
      });

      assert.deepEqual(array, [2, 4]);
      assert.deepEqual(actual, [1, 3]);
      assert.deepEqual(lodash.remove(), []);
    });

    QUnit.test('should accept a variety of options', function(assert) {
      assert.expect(8);

      var array = [1, 2, 3, 4],
          predicate = function(n) { return n % 2 == 0; },
          value = _.clone(array),
          remove = convert('remove', _.remove, { 'cap': false }),
          actual = remove(function(n, index) { return index % 2 == 0; })(value);

      assert.deepEqual(value, [1, 2, 3, 4]);
      assert.deepEqual(actual, [2, 4]);

      remove = convert('remove', _.remove, { 'curry': false });
      actual = remove(predicate);

      assert.deepEqual(actual, []);

      var trim = convert('trim', _.trim, { 'fixed': false });
      assert.strictEqual(trim('_-abc-_', '_-'), 'abc');

      value = _.clone(array);
      remove = convert('remove', _.remove, { 'immutable': false });
      actual = remove(predicate)(value);

      assert.deepEqual(value, [1, 3]);
      assert.deepEqual(actual, [2, 4]);

      value = _.clone(array);
      remove = convert('remove', _.remove, { 'rearg': false });
      actual = remove(value)(predicate);

      assert.deepEqual(value, [1, 2, 3, 4]);
      assert.deepEqual(actual, [1, 3]);
    });

    QUnit.test('should respect the `cap` option', function(assert) {
      assert.expect(1);

      var iteratee = convert('iteratee', _.iteratee, { 'cap': false });

      var func = iteratee(function(a, b, c) {
        return [a, b, c];
      }, 3);

      assert.deepEqual(func(1, 2, 3), [1, 2, 3]);
    });

    QUnit.test('should respect the `rearg` option', function(assert) {
      assert.expect(1);

      var add = convert('add', _.add, { 'rearg': true });

      assert.strictEqual(add('2')('1'), '12');
    });

    QUnit.test('should only add a `placeholder` property if needed', function(assert) {
      assert.expect(2);

      if (!document) {
        var methodNames = _.keys(mapping.placeholder),
            expected = _.map(methodNames, _.constant(true));

        var actual = _.map(methodNames, function(methodName) {
          var object = {};
          object[methodName] = _[methodName];

          var lodash = convert(object);
          return methodName in lodash;
        });

        assert.deepEqual(actual, expected);

        var lodash = convert({ 'add': _.add });
        assert.notOk('placeholder' in lodash);
      }
      else {
        skipAssert(assert, 2);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('method.convert');

  (function() {
    QUnit.test('should exist on unconverted methods', function(assert) {
      assert.expect(2);

      var array = [],
          isArray = fp.isArray.convert({ 'curry': true });

      assert.strictEqual(fp.isArray(array), true);
      assert.strictEqual(isArray()(array), true);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('convert methods');

  _.each(['fp.convert', 'method.convert'], function(methodName) {
    var isFp = methodName == 'fp.convert',
        func = isFp ? fp.convert : fp.remove.convert;

    QUnit.test('`' + methodName + '` should work with an object', function(assert) {
      assert.expect(3);

      var array = [1, 2, 3, 4],
          lodash = func(allFalseOptions),
          remove = isFp ? lodash.remove : lodash;

      var actual = remove(array, function(n, index) {
        return index % 2 == 0;
      });

      assert.deepEqual(array, [2, 4]);
      assert.deepEqual(actual, [1, 3]);
      assert.deepEqual(remove(), []);
    });

    QUnit.test('`' + methodName + '` should extend existing configs', function(assert) {
      assert.expect(2);

      var array = [1, 2, 3, 4],
          lodash = func({ 'cap': false }),
          remove = (isFp ? lodash.remove : lodash).convert({ 'rearg': false });

      var actual = remove(array)(function(n, index) {
        return index % 2 == 0;
      });

      assert.deepEqual(array, [1, 2, 3, 4]);
      assert.deepEqual(actual, [2, 4]);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('method arity checks');

  (function() {
    QUnit.test('should wrap methods with an arity > `1`', function(assert) {
      assert.expect(1);

      var methodNames = _.filter(_.functions(fp), function(methodName) {
        return fp[methodName].length > 1;
      });

      assert.deepEqual(methodNames, []);
    });

    QUnit.test('should have >= arity of `aryMethod` designation', function(assert) {
      assert.expect(4);

      _.times(4, function(index) {
        var aryCap = index + 1;

        var methodNames = _.filter(mapping.aryMethod[aryCap], function(methodName) {
          var key = _.result(mapping.remap, methodName, methodName),
              arity = _[key].length;

          return arity != 0 && arity < aryCap;
        });

        assert.deepEqual(methodNames, [], '`aryMethod[' + aryCap + ']`');
      });
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('method aliases');

  (function() {
    QUnit.test('should have correct aliases', function(assert) {
      assert.expect(1);

      var actual = _.transform(mapping.aliasToReal, function(result, realName, alias) {
        result.push([alias, fp[alias] === fp[realName]]);
      }, []);

      assert.deepEqual(_.reject(actual, 1), []);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('method ary caps');

  (function() {
    QUnit.test('should have a cap of 1', function(assert) {
      assert.expect(1);

      var funcMethods = [
        'curry', 'iteratee', 'memoize', 'over', 'overEvery', 'overSome',
        'method', 'methodOf', 'rest', 'runInContext'
      ];

      var exceptions = funcMethods.concat('mixin', 'template'),
          expected = _.map(mapping.aryMethod[1], _.constant(true));

      var actual = _.map(mapping.aryMethod[1], function(methodName) {
        var arg = _.includes(funcMethods, methodName) ? _.noop : 1,
            result = _.attempt(function() { return fp[methodName](arg); });

        if (_.includes(exceptions, methodName)
              ? typeof result == 'function'
              : typeof result != 'function'
            ) {
          return true;
        }
        console.log(methodName, result);
        return false;
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should have a cap of 2', function(assert) {
      assert.expect(1);

      var funcMethods = [
        'after', 'ary', 'before', 'bind', 'bindKey', 'curryN', 'debounce',
        'delay', 'overArgs', 'partial', 'partialRight', 'rearg', 'throttle',
        'wrap'
      ];

      var exceptions = _.difference(funcMethods.concat('matchesProperty'), ['cloneDeepWith', 'cloneWith', 'delay']),
          expected = _.map(mapping.aryMethod[2], _.constant(true));

      var actual = _.map(mapping.aryMethod[2], function(methodName) {
        var args = _.includes(funcMethods, methodName) ? [methodName == 'curryN' ? 1 : _.noop, _.noop] : [1, []],
            result = _.attempt(function() { return fp[methodName](args[0])(args[1]); });

        if (_.includes(exceptions, methodName)
              ? typeof result == 'function'
              : typeof result != 'function'
            ) {
          return true;
        }
        console.log(methodName, result);
        return false;
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should have a cap of 3', function(assert) {
      assert.expect(1);

      var funcMethods = [
        'assignWith', 'extendWith', 'isEqualWith', 'isMatchWith', 'reduce',
        'reduceRight', 'transform', 'zipWith'
      ];

      var expected = _.map(mapping.aryMethod[3], _.constant(true));

      var actual = _.map(mapping.aryMethod[3], function(methodName) {
        var args = _.includes(funcMethods, methodName) ? [_.noop, 0, 1] : [0, 1, []],
            result = _.attempt(function() { return fp[methodName](args[0])(args[1])(args[2]); });

        if (typeof result != 'function') {
          return true;
        }
        console.log(methodName, result);
        return false;
      });

      assert.deepEqual(actual, expected);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('methods that use `indexOf`');

  (function() {
    QUnit.test('should work with `fp.indexOf`', function(assert) {
      assert.expect(10);

      var array = ['a', 'b', 'c'],
          other = ['b', 'd', 'b'],
          object = { 'a': 1, 'b': 2, 'c': 2 },
          actual = fp.difference(array)(other);

      assert.deepEqual(actual, ['a', 'c'], 'fp.difference');

      actual = fp.includes('b')(array);
      assert.strictEqual(actual, true, 'fp.includes');

      actual = fp.intersection(other)(array);
      assert.deepEqual(actual, ['b'], 'fp.intersection');

      actual = fp.omit(other)(object);
      assert.deepEqual(actual, { 'a': 1, 'c': 2 }, 'fp.omit');

      actual = fp.union(other)(array);
      assert.deepEqual(actual, ['a', 'b', 'c', 'd'], 'fp.union');

      actual = fp.uniq(other);
      assert.deepEqual(actual, ['b', 'd'], 'fp.uniq');

      actual = fp.uniqBy(_.identity, other);
      assert.deepEqual(actual, ['b', 'd'], 'fp.uniqBy');

      actual = fp.without(array)(other);
      assert.deepEqual(actual, ['a', 'c'], 'fp.without');

      actual = fp.xor(other)(array);
      assert.deepEqual(actual, ['a', 'c', 'd'], 'fp.xor');

      actual = fp.pull('b')(array);
      assert.deepEqual(actual, ['a', 'c'], 'fp.pull');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('cherry-picked methods');

  (function() {
    QUnit.test('should provide the correct `iteratee` arguments', function(assert) {
      assert.expect(4);

      var args,
          array = [1, 2, 3],
          object = { 'a': 1, 'b': 2 },
          isFIFO = _.keys(object)[0] == 'a',
          map = convert('map', _.map),
          reduce = convert('reduce', _.reduce);

      map(function() {
        args || (args = slice.call(arguments));
      })(array);

      assert.deepEqual(args, [1]);

      args = undefined;
      map(function() {
        args || (args = slice.call(arguments));
      })(object);

      assert.deepEqual(args, isFIFO ? [1] : [2]);

      args = undefined;
      reduce(function() {
        args || (args = slice.call(arguments));
      })(0)(array);

      assert.deepEqual(args, [0, 1]);

      args = undefined;
      reduce(function() {
        args || (args = slice.call(arguments));
      })(0)(object);

      assert.deepEqual(args, isFIFO ? [0, 1] : [0, 2]);
    });

    QUnit.test('should not support shortcut fusion', function(assert) {
      assert.expect(3);

      var array = fp.range(0, LARGE_ARRAY_SIZE),
          filterCount = 0,
          mapCount = 0;

      var iteratee = function(value) {
        mapCount++;
        return value * value;
      };

      var predicate = function(value) {
        filterCount++;
        return value % 2 == 0;
      };

      var map1 = convert('map', _.map),
          filter1 = convert('filter', _.filter),
          take1 = convert('take', _.take);

      var filter2 = filter1(predicate),
          map2 = map1(iteratee),
          take2 = take1(2);

      var combined = fp.flow(map2, filter2, fp.compact, take2);

      assert.deepEqual(combined(array), [4, 16]);
      assert.strictEqual(filterCount, 200, 'filterCount');
      assert.strictEqual(mapCount, 200, 'mapCount');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('iteratee shorthands');

  (function() {
    var objects = [{ 'a': 1, 'b': 2 }, { 'a': 3, 'b': 4 }];

    QUnit.test('should work with "_.matches" shorthands', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.filter({ 'a': 3 })(objects), [objects[1]]);
    });

    QUnit.test('should work with "_.matchesProperty" shorthands', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.filter(['a', 3])(objects), [objects[1]]);
    });

    QUnit.test('should work with "_.property" shorthands', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.map('a')(objects), [1, 3]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('mutation methods');

  (function() {
    var array = [1, 2, 3],
        object = { 'a': 1 },
        deepObject = { 'a': { 'b': 2, 'c': 3 } };

    QUnit.test('should not mutate values', function(assert) {
      assert.expect(42);

      function Foo() {}
      Foo.prototype = { 'b': 2 };

      var value = _.clone(object),
          actual = fp.assign(value)({ 'b': 2 });

      assert.deepEqual(value, object, 'fp.assign');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.assign');

      value = _.clone(object);
      actual = fp.assignWith(function(objValue, srcValue) {
        return srcValue;
      })(value)({ 'b': 2 });

      assert.deepEqual(value, object, 'fp.assignWith');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.assignWith');

      value = _.clone(object);
      actual = fp.assignIn(value)(new Foo);

      assert.deepEqual(value, object, 'fp.assignIn');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.assignIn');

      value = _.clone(object);
      actual = fp.assignInWith(function(objValue, srcValue) {
        return srcValue;
      })(value)(new Foo);

      assert.deepEqual(value, object, 'fp.assignInWith');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.assignInWith');

      value = _.clone(object);
      actual = fp.defaults({ 'a': 2, 'b': 2 })(value);

      assert.deepEqual(value, object, 'fp.defaults');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.defaults');

      value = _.cloneDeep(deepObject);
      actual = fp.defaultsDeep({ 'a': { 'c': 4, 'd': 4 } })(deepObject);

      assert.deepEqual(value, { 'a': { 'b': 2, 'c': 3 } }, 'fp.defaultsDeep');
      assert.deepEqual(actual, { 'a': { 'b': 2, 'c': 3, 'd': 4 } }, 'fp.defaultsDeep');

      value = _.clone(object);
      actual = fp.extend(value)(new Foo);

      assert.deepEqual(value, object, 'fp.extend');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.extend');

      value = _.clone(object);
      actual = fp.extendWith(function(objValue, srcValue) {
        return srcValue;
      })(value)(new Foo);

      assert.deepEqual(value, object, 'fp.extendWith');
      assert.deepEqual(actual, { 'a': 1, 'b': 2 }, 'fp.extendWith');

      value = _.clone(array);
      actual = fp.fill(1)(2)('*')(value);

      assert.deepEqual(value, array, 'fp.fill');
      assert.deepEqual(actual, [1, '*', 3], 'fp.fill');

      value = _.cloneDeep(deepObject);
      actual = fp.merge(value)({ 'a': { 'd': 4 } });

      assert.deepEqual(value, { 'a': { 'b': 2, 'c': 3 } }, 'fp.merge');
      assert.deepEqual(actual, { 'a': { 'b': 2, 'c': 3, 'd': 4 } }, 'fp.merge');

      value = _.cloneDeep(deepObject);
      value.a.b = [1];

      actual = fp.mergeWith(function(objValue, srcValue) {
        if (_.isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      }, value, { 'a': { 'b': [2, 3] } });

      assert.deepEqual(value, { 'a': { 'b': [1], 'c': 3 } }, 'fp.mergeWith');
      assert.deepEqual(actual, { 'a': { 'b': [1, 2, 3], 'c': 3 } }, 'fp.mergeWith');

      value = _.clone(array);
      actual = fp.pull(2)(value);

      assert.deepEqual(value, array, 'fp.pull');
      assert.deepEqual(actual, [1, 3], 'fp.pull');

      value = _.clone(array);
      actual = fp.pullAll([1, 3])(value);

      assert.deepEqual(value, array, 'fp.pullAll');
      assert.deepEqual(actual, [2], 'fp.pullAll');

      value = _.clone(array);
      actual = fp.pullAt([0, 2])(value);

      assert.deepEqual(value, array, 'fp.pullAt');
      assert.deepEqual(actual, [2], 'fp.pullAt');

      value = _.clone(array);
      actual = fp.remove(function(value) {
        return value === 2;
      })(value);

      assert.deepEqual(value, array, 'fp.remove');
      assert.deepEqual(actual, [1, 3], 'fp.remove');

      value = _.clone(array);
      actual = fp.reverse(value);

      assert.deepEqual(value, array, 'fp.reverse');
      assert.deepEqual(actual, [3, 2, 1], 'fp.reverse');

      value = _.cloneDeep(deepObject);
      actual = fp.set('a.b')(3)(value);

      assert.deepEqual(value, deepObject, 'fp.set');
      assert.deepEqual(actual, { 'a': { 'b': 3, 'c': 3 } }, 'fp.set');

      value = _.cloneDeep(deepObject);
      actual = fp.setWith(Object)('d.e')(4)(value);

      assert.deepEqual(value, deepObject, 'fp.setWith');
      assert.deepEqual(actual, { 'a': { 'b': 2, 'c': 3 }, 'd': { 'e': 4 } }, 'fp.setWith');

      value = _.cloneDeep(deepObject);
      actual = fp.unset('a.b')(value);

      assert.deepEqual(value, deepObject, 'fp.unset');
      assert.deepEqual(actual, { 'a': { 'c': 3 } }, 'fp.unset');

      value = _.cloneDeep(deepObject);
      actual = fp.update('a.b')(function(n) { return n * n; })(value);

      assert.deepEqual(value, deepObject, 'fp.update');
      assert.deepEqual(actual, { 'a': { 'b': 4, 'c': 3 } }, 'fp.update');

      value = _.cloneDeep(deepObject);
      actual = fp.updateWith(Object)('d.e')(_.constant(4))(value);

      assert.deepEqual(value, deepObject, 'fp.updateWith');
      assert.deepEqual(actual, { 'a': { 'b': 2, 'c': 3 }, 'd': { 'e': 4 } }, 'fp.updateWith');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('placeholder methods');

  (function() {
    QUnit.test('should use `fp` as the default placeholder', function(assert) {
      assert.expect(3);

      var actual = fp.add(fp, 'b')('a');
      assert.strictEqual(actual, 'ab');

      actual = fp.slice(fp, 2)(1)(['a', 'b', 'c']);
      assert.deepEqual(actual, ['b']);

      actual = fp.fill(fp, 2)(1, '*')([1, 2, 3]);
      assert.deepEqual(actual, [1, '*', 3]);
    });

    QUnit.test('should support `fp.placeholder`', function(assert) {
      assert.expect(6);

      _.each([[], fp.__], function(ph) {
        fp.placeholder = ph;

        var actual = fp.add(ph, 'b')('a');
        assert.strictEqual(actual, 'ab');

        actual = fp.slice(ph, 2)(1)(['a', 'b', 'c']);
        assert.deepEqual(actual, ['b']);

        actual = fp.fill(ph, 2)(1, '*')([1, 2, 3]);
        assert.deepEqual(actual, [1, '*', 3]);
      });
    });

    _.forOwn(mapping.placeholder, function(truthy, methodName) {
      var func = fp[methodName];

      QUnit.test('`_.' + methodName + '` should have a `placeholder` property', function(assert) {
        assert.expect(2);

        assert.ok(_.isObject(func.placeholder));
        assert.strictEqual(func.placeholder, fp.__);
      });
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('set methods');

  (function() {
    QUnit.test('should only clone objects in `path`', function(assert) {
      assert.expect(11);

      var object = { 'a': { 'b': 2, 'c': 3 }, 'd': { 'e': 4 } },
          value = _.cloneDeep(object),
          actual = fp.set('a.b.c.d', 5, value);

      assert.ok(_.isObject(actual.a.b), 'fp.set');
      assert.ok(_.isNumber(actual.a.b), 'fp.set');

      assert.strictEqual(actual.a.b.c.d, 5, 'fp.set');
      assert.strictEqual(actual.d, value.d, 'fp.set');

      value = _.cloneDeep(object);
      actual = fp.setWith(Object)('[0][1]')('a')(value);

      assert.deepEqual(actual[0], { '1': 'a' }, 'fp.setWith');

      value = _.cloneDeep(object);
      actual = fp.unset('a.b')(value);

      assert.notOk('b' in actual.a, 'fp.unset');
      assert.strictEqual(actual.a.c, value.a.c, 'fp.unset');

      value = _.cloneDeep(object);
      actual = fp.update('a.b')(function(n) { return n * n; })(value);

      assert.strictEqual(actual.a.b, 4, 'fp.update');
      assert.strictEqual(actual.d, value.d, 'fp.update');

      value = _.cloneDeep(object);
      actual = fp.updateWith(Object)('[0][1]')(_.constant('a'))(value);

      assert.deepEqual(actual[0], { '1': 'a' }, 'fp.updateWith');
      assert.strictEqual(actual.d, value.d, 'fp.updateWith');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('with methods');

  (function() {
    var object = { 'a': 1 };

    QUnit.test('should provide the correct `customizer` arguments', function(assert) {
      assert.expect(7);

      var args,
          value = _.clone(object);

      fp.assignWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })(value)({ 'b': 2 });

      assert.deepEqual(args, [undefined, 2, 'b', { 'a': 1 }, { 'b': 2 }], 'fp.assignWith');

      args = undefined;
      value = _.clone(object);

      fp.extendWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })(value)({ 'b': 2 });

      assert.deepEqual(args, [undefined, 2, 'b', { 'a': 1 }, { 'b': 2 }], 'fp.extendWith');

      var iteration = 0,
          objects = [{ 'a': 1 }, { 'a': 2 }],
          stack = { '__data__': { '__data__': [objects] } },
          expected = [1, 2, 'a', objects[0], objects[1], stack];

      args = undefined;

      fp.isEqualWith(function() {
        if (++iteration == 2) {
          args = _.map(arguments, _.cloneDeep);
        }
      })(objects[0])(objects[1]);

      args[5] = _.omitBy(args[5], _.isFunction);
      args[5].__data__ = _.omitBy(args[5].__data__, _.isFunction);

      assert.deepEqual(args, expected, 'fp.isEqualWith');

      args = undefined;
      stack = { '__data__': { '__data__': [] } };
      expected = [2, 1, 'a', objects[1], objects[0], stack];

      fp.isMatchWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })(objects[0])(objects[1]);

      args[5] = _.omitBy(args[5], _.isFunction);
      args[5].__data__ = _.omitBy(args[5].__data__, _.isFunction);

      assert.deepEqual(args, expected, 'fp.isMatchWith');

      args = undefined;
      value = { 'a': [1] };
      expected = [[1], [2, 3], 'a', { 'a': [1] }, { 'a': [2, 3] }, stack];

      fp.mergeWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })(value)({ 'a': [2, 3] });

      args[5] = _.omitBy(args[5], _.isFunction);
      args[5].__data__ = _.omitBy(args[5].__data__, _.isFunction);

      assert.deepEqual(args, expected, 'fp.mergeWith');

      args = undefined;
      value = _.clone(object);

      fp.setWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })('b.c')(2)(value);

      assert.deepEqual(args, [undefined, 'b', { 'a': 1 }], 'fp.setWith');

      args = undefined;
      value = _.clone(object);

      fp.updateWith(function() {
        args || (args = _.map(arguments, _.cloneDeep));
      })('b.c')(_.constant(2))(value);

      assert.deepEqual(args, [undefined, 'b', { 'a': 1 }], 'fp.updateWith');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.add and fp.subtract');

  _.each(['add', 'subtract'], function(methodName) {
    var func = fp[methodName],
        isAdd = methodName == 'add';

    QUnit.test('`fp.' + methodName + '` should not have `rearg` applied', function(assert) {
      assert.expect(1);

      assert.strictEqual(func('1')('2'), isAdd ? '12' : -1);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.castArray');

  (function() {
    QUnit.test('should shallow clone array values', function(assert) {
      assert.expect(2);

      var array = [1],
          actual = fp.castArray(array);

      assert.deepEqual(actual, array);
      assert.notStrictEqual(actual, array);
    });

    QUnit.test('should not shallow clone non-array values', function(assert) {
      assert.expect(2);

      var object = { 'a': 1 },
          actual = fp.castArray(object);

      assert.deepEqual(actual, [object]);
      assert.strictEqual(actual[0], object);
    });

    QUnit.test('should convert by name', function(assert) {
      assert.expect(4);

      var array = [1],
          object = { 'a': 1 },
          castArray = convert('castArray', _.castArray),
          actual = castArray(array);

      assert.deepEqual(actual, array);
      assert.notStrictEqual(actual, array);

      actual = castArray(object);
      assert.deepEqual(actual, [object]);
      assert.strictEqual(actual[0], object);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('curry methods');

  _.each(['curry', 'curryRight'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`_.' + methodName + '` should only accept a `func` param', function(assert) {
      assert.expect(1);

      assert.raises(function() { func(1, _.noop); }, TypeError);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('curryN methods');

  _.each(['curryN', 'curryRightN'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`_.' + methodName + '` should accept an `arity` param', function(assert) {
      assert.expect(1);

      var actual = func(1)(function(a, b) { return [a, b]; })('a');
      assert.deepEqual(actual, ['a', undefined]);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.difference');

  (function() {
    QUnit.test('should return the elements of the first array not included in the second array', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.difference([1, 2])([2, 3]), [1]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.divide and fp.multiply');

  _.each(['divide', 'multiply'], function(methodName) {
    var func = fp[methodName],
        isDivide = methodName == 'divide';

    QUnit.test('`fp.' + methodName + '` should not have `rearg` applied', function(assert) {
      assert.expect(1);

      assert.strictEqual(func('2')('4'), isDivide ? 0.5 : 8);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.extend');

  (function() {
    QUnit.test('should convert by name', function(assert) {
      assert.expect(2);

      function Foo() {}
      Foo.prototype = { 'b': 2 };

      var object = { 'a': 1 },
          extend = convert('extend', _.extend),
          value = _.clone(object),
          actual = extend(value)(new Foo);

      assert.deepEqual(value, object);
      assert.deepEqual(actual, { 'a': 1, 'b': 2 });
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.fill');

  (function() {
    QUnit.test('should have an argument order of `start`, `end`, then `value`', function(assert) {
      assert.expect(1);

      var array = [1, 2, 3];
      assert.deepEqual(fp.fill(1)(2)('*')(array), [1, '*', 3]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.flatMapDepth');

  (function() {
    QUnit.test('should have an argument order of `iteratee`, `depth`, then `collection`', function(assert) {
      assert.expect(2);

      function duplicate(n) {
        return [[[n, n]]];
      }

      var array = [1, 2],
          object = { 'a': 1, 'b': 2 },
          expected = [[1, 1], [2, 2]];

      assert.deepEqual(fp.flatMapDepth(duplicate)(2)(array), expected);
      assert.deepEqual(fp.flatMapDepth(duplicate)(2)(object), expected);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('flow methods');

  _.each(['flow', 'flowRight'], function(methodName) {
    var func = fp[methodName],
        isFlow = methodName == 'flow';

    QUnit.test('`fp.' + methodName + '` should support shortcut fusion', function(assert) {
      assert.expect(6);

      var filterCount,
          mapCount,
          array = fp.range(0, LARGE_ARRAY_SIZE);

      var iteratee = function(value) {
        mapCount++;
        return value * value;
      };

      var predicate = function(value) {
        filterCount++;
        return value % 2 == 0;
      };

      var filter = fp.filter(predicate),
          map = fp.map(iteratee),
          take = fp.take(2);

      _.times(2, function(index) {
        var combined = isFlow
          ? func(map, filter, fp.compact, take)
          : func(take, fp.compact, filter, map);

        filterCount = mapCount = 0;

        if (WeakMap && WeakMap.name) {
          assert.deepEqual(combined(array), [4, 16]);
          assert.strictEqual(filterCount, 5, 'filterCount');
          assert.strictEqual(mapCount, 5, 'mapCount');
        }
        else {
          skipAssert(assert, 3);
        }
      });
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('forEach methods');

  _.each(['forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`fp.' + methodName + '` should provide `value` to `iteratee`', function(assert) {
      assert.expect(2);

      var args;

      func(function() {
        args || (args = slice.call(arguments));
      })(['a']);

      assert.deepEqual(args, ['a']);

      args = undefined;

      func(function() {
        args || (args = slice.call(arguments));
      })({ 'a': 1 });

      assert.deepEqual(args, [1]);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.getOr');

  (function() {
    QUnit.test('should accept a `defaultValue` param', function(assert) {
      assert.expect(1);

      var actual = fp.getOr('default')('path')({});
      assert.strictEqual(actual, 'default');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.gt and fp.gte');

  _.each(['gt', 'gte'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`fp.' + methodName + '` should have `rearg` applied', function(assert) {
      assert.expect(1);

      assert.strictEqual(func(2)(1), true);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.inRange');

  (function() {
    QUnit.test('should have an argument order of `start`, `end`, then `value`', function(assert) {
      assert.expect(2);

      assert.strictEqual(fp.inRange(2)(4)(3), true);
      assert.strictEqual(fp.inRange(-2)(-6)(-3), true);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.invoke');

  (function() {
    QUnit.test('should not accept an `args` param', function(assert) {
      assert.expect(1);

      var actual = fp.invoke('toUpperCase')('a');
      assert.strictEqual(actual, 'A');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.invokeMap');

  (function() {
    QUnit.test('should not accept an `args` param', function(assert) {
      assert.expect(1);

      var actual = fp.invokeMap('toUpperCase')(['a', 'b']);
      assert.deepEqual(actual, ['A', 'B']);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.invokeArgs');

  (function() {
    QUnit.test('should accept an `args` param', function(assert) {
      assert.expect(1);

      var actual = fp.invokeArgs('concat')(['b', 'c'])('a');
      assert.strictEqual(actual, 'abc');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.invokeArgsMap');

  (function() {
    QUnit.test('should accept an `args` param', function(assert) {
      assert.expect(1);

      var actual = fp.invokeArgsMap('concat')(['b', 'c'])(['a', 'A']);
      assert.deepEqual(actual, ['abc', 'Abc']);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.iteratee');

  (function() {
    QUnit.test('should return a iteratee with capped params', function(assert) {
      assert.expect(1);

      var func = fp.iteratee(function(a, b, c) { return [a, b, c]; }, 3);
      assert.deepEqual(func(1, 2, 3), [1, undefined, undefined]);
    });

    QUnit.test('should convert by name', function(assert) {
      assert.expect(1);

      var iteratee = convert('iteratee', _.iteratee),
          func = iteratee(function(a, b, c) { return [a, b, c]; }, 3);

      assert.deepEqual(func(1, 2, 3), [1, undefined, undefined]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.lt and fp.lte');

  _.each(['lt', 'lte'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`fp.' + methodName + '` should have `rearg` applied', function(assert) {
      assert.expect(1);

      assert.strictEqual(func(1)(2), true);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.mapKeys');

  (function() {
    QUnit.test('should only provide `key` to `iteratee`', function(assert) {
      assert.expect(1);

      var args;

      fp.mapKeys(function() {
        args || (args = slice.call(arguments));
      }, { 'a': 1 });

      assert.deepEqual(args, ['a']);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.maxBy and fp.minBy');

  _.each(['maxBy', 'minBy'], function(methodName) {
    var array = [1, 2, 3],
        func = fp[methodName],
        isMax = methodName == 'maxBy';

    QUnit.test('`fp.' + methodName + '` should work with an `iteratee` argument', function(assert) {
      assert.expect(1);

      var actual = func(function(num) {
        return -num;
      })(array);

      assert.strictEqual(actual, isMax ? 1 : 3);
    });

    QUnit.test('`fp.' + methodName + '` should provide the correct `iteratee` arguments', function(assert) {
      assert.expect(1);

      var args;

      func(function() {
        args || (args = slice.call(arguments));
      })(array);

      assert.deepEqual(args, [1]);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.mixin');

  (function() {
    var source = { 'a': _.noop };

    QUnit.test('should mixin static methods but not prototype methods', function(assert) {
      assert.expect(2);

      fp.mixin(source);

      assert.strictEqual(typeof fp.a, 'function');
      assert.notOk('a' in fp.prototype);

      delete fp.a;
      delete fp.prototype.a;
    });

    QUnit.test('should not assign inherited `source` methods', function(assert) {
      assert.expect(2);

      function Foo() {}
      Foo.prototype.a = _.noop;
      fp.mixin(new Foo);

      assert.notOk('a' in fp);
      assert.notOk('a' in fp.prototype);

      delete fp.a;
      delete fp.prototype.a;
    });

    QUnit.test('should not remove existing prototype methods', function(assert) {
      assert.expect(2);

      var each1 = fp.each,
          each2 = fp.prototype.each;

      fp.mixin({ 'each': source.a });

      assert.strictEqual(fp.each, source.a);
      assert.strictEqual(fp.prototype.each, each2);

      fp.each = each1;
      fp.prototype.each = each2;
    });

    QUnit.test('should not export to the global when `source` is not an object', function(assert) {
      assert.expect(2);

      var props = _.without(_.keys(_), '_');

      _.times(2, function(index) {
        fp.mixin.apply(fp, index ? [1] : []);

        assert.ok(_.every(props, function(key) {
          return root[key] !== fp[key];
        }));

        _.each(props, function(key) {
          if (root[key] === fp[key]) {
            delete root[key];
          }
        });
      });
    });

    QUnit.test('should convert by name', function(assert) {
      assert.expect(3);

      var object = { 'mixin': convert('mixin', _.mixin) };

      function Foo() {}
      Foo.mixin = object.mixin;
      Foo.mixin(source);

      assert.strictEqual(typeof Foo.a, 'function');
      assert.notOk('a' in Foo.prototype);

      object.mixin(source);
      assert.strictEqual(typeof object.a, 'function');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.over');

  (function() {
    QUnit.test('should not cap iteratee args', function(assert) {
      assert.expect(2);

      _.each([fp.over, convert('over', _.over)], function(func) {
        var over = func([Math.max, Math.min]);
        assert.deepEqual(over(1, 2, 3, 4), [4, 1]);
      });
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.omitBy and fp.pickBy');

  _.each(['omitBy', 'pickBy'], function(methodName) {
    var func = fp[methodName];

    QUnit.test('`fp.' + methodName + '` should provide `value` and `key` to `iteratee`', function(assert) {
      assert.expect(1);

      var args;

      func(function() {
        args || (args = slice.call(arguments));
      })({ 'a': 1 });

      assert.deepEqual(args, [1, 'a']);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.update');

  (function() {
    QUnit.test('should not convert end of `path` to an object', function(assert) {
      assert.expect(1);

      var actual = fp.update('a.b')(_.identity)({ 'a': { 'b': 1 } });
      assert.strictEqual(typeof actual.a.b, 'number');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('padChars methods');

  _.each(['padChars', 'padCharsStart', 'padCharsEnd'], function(methodName) {
    var func = fp[methodName],
        isPad = methodName == 'padChars',
        isStart = methodName == 'padCharsStart';

    QUnit.test('`_.' + methodName + '` should truncate pad characters to fit the pad length', function(assert) {
      assert.expect(1);

      if (isPad) {
        assert.strictEqual(func('_-')(8)('abc'), '_-abc_-_');
      } else {
        assert.strictEqual(func('_-')(6)('abc'), isStart ? '_-_abc' : 'abc_-_');
      }
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('partial methods');

  _.each(['partial', 'partialRight'], function(methodName) {
    var func = fp[methodName],
        isPartial = methodName == 'partial';

    QUnit.test('`_.' + methodName + '` should accept an `args` param', function(assert) {
      assert.expect(1);

      var expected = isPartial ? [1, 2, 3] : [0, 1, 2];

      var actual = func(function(a, b, c) {
        return [a, b, c];
      })([1, 2])(isPartial ? 3 : 0);

      assert.deepEqual(actual, expected);
    });

    QUnit.test('`_.' + methodName + '` should convert by name', function(assert) {
      assert.expect(2);

      var expected = isPartial ? [1, 2, 3] : [0, 1, 2],
          par = convert(methodName, _[methodName]),
          ph = par.placeholder;

      var actual = par(function(a, b, c) {
        return [a, b, c];
      })([1, 2])(isPartial ? 3 : 0);

      assert.deepEqual(actual, expected);

      actual = par(function(a, b, c) {
        return [a, b, c];
      })([ph, 2])(isPartial ? 1 : 0, isPartial ? 3 : 1);

      assert.deepEqual(actual, expected);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.random');

  (function() {
    var array = Array(1000);

    QUnit.test('should support a `min` and `max` argument', function(assert) {
      assert.expect(1);

      var min = 5,
          max = 10;

      assert.ok(_.some(array, function() {
        var result = fp.random(min)(max);
        return result >= min && result <= max;
      }));
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.range');

  (function() {
    QUnit.test('should have an argument order of `start` then `end`', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.range(1)(4), [1, 2, 3]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('reduce methods');

  _.each(['reduce', 'reduceRight'], function(methodName) {
    var func = fp[methodName],
        isReduce = methodName == 'reduce';

    QUnit.test('`_.' + methodName + '` should provide the correct `iteratee` arguments when iterating an array', function(assert) {
      assert.expect(1);

      var args;

      func(function() {
        args || (args = slice.call(arguments));
      })(0)([1, 2, 3]);

      assert.deepEqual(args, isReduce ? [0, 1] : [0, 3]);
    });

    QUnit.test('`_.' + methodName + '` should provide the correct `iteratee` arguments when iterating an object', function(assert) {
      assert.expect(1);

      var args,
          object = { 'a': 1, 'b': 2 },
          isFIFO = _.keys(object)[0] == 'a';

      var expected = isFIFO
        ? (isReduce ? [0, 1] : [0, 2])
        : (isReduce ? [0, 2] : [0, 1]);

      func(function() {
        args || (args = slice.call(arguments));
      })(0)(object);

      assert.deepEqual(args, expected);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.restFrom');

  (function() {
    QUnit.test('should accept a `start` param', function(assert) {
      assert.expect(1);

      var actual = fp.restFrom(2)(function() {
        return slice.call(arguments);
      })('a', 'b', 'c', 'd');

      assert.deepEqual(actual, ['a', 'b', ['c', 'd']]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.runInContext');

  (function() {
    QUnit.test('should return a converted lodash instance', function(assert) {
      assert.expect(1);

      assert.strictEqual(typeof fp.runInContext({}).curryN, 'function');
    });

    QUnit.test('should convert by name', function(assert) {
      assert.expect(1);

      var runInContext = convert('runInContext', _.runInContext);
      assert.strictEqual(typeof runInContext({}).curryN, 'function');
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.spreadFrom');

  (function() {
    QUnit.test('should accept a `start` param', function(assert) {
      assert.expect(1);

      var actual = fp.spreadFrom(2)(function() {
        return slice.call(arguments);
      })('a', 'b', ['c', 'd']);

      assert.deepEqual(actual, ['a', 'b', 'c', 'd']);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('trimChars methods');

  _.each(['trimChars', 'trimCharsStart', 'trimCharsEnd'], function(methodName, index) {
    var func = fp[methodName],
        parts = [];

    if (index != 2) {
      parts.push('leading');
    }
    if (index != 1) {
      parts.push('trailing');
    }
    parts = parts.join(' and ');

    QUnit.test('`_.' + methodName + '` should remove ' + parts + ' `chars`', function(assert) {
      assert.expect(1);

      var string = '-_-a-b-c-_-',
          expected = (index == 2 ? '-_-' : '') + 'a-b-c' + (index == 1 ? '-_-' : '');

      assert.strictEqual(func('_-')(string), expected);
    });
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.uniqBy');

  (function() {
    var objects = [{ 'a': 2 }, { 'a': 3 }, { 'a': 1 }, { 'a': 2 }, { 'a': 3 }, { 'a': 1 }];

    QUnit.test('should work with an `iteratee` argument', function(assert) {
      assert.expect(1);

      var expected = objects.slice(0, 3);

      var actual = fp.uniqBy(function(object) {
        return object.a;
      })(objects);

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should provide the correct `iteratee` arguments', function(assert) {
      assert.expect(1);

      var args;

      fp.uniqBy(function() {
        args || (args = slice.call(arguments));
      })(objects);

      assert.deepEqual(args, [objects[0]]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.zip');

  (function() {
    QUnit.test('should zip together two arrays', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.zip([1, 2])([3, 4]), [[1, 3], [2, 4]]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.zipObject');

  (function() {
    QUnit.test('should zip together key/value arrays into an object', function(assert) {
      assert.expect(1);

      assert.deepEqual(fp.zipObject(['a', 'b'])([1, 2]), { 'a': 1, 'b': 2 });
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.module('fp.zipWith');

  (function() {
    QUnit.test('should zip arrays combining grouped elements with `iteratee`', function(assert) {
      assert.expect(1);

      var array1 = [1, 2, 3],
          array2 = [4, 5, 6];

      var actual = fp.zipWith(function(a, b) {
        return a + b;
      })(array1)(array2);

      assert.deepEqual(actual, [5, 7, 9]);
    });
  }());

  /*--------------------------------------------------------------------------*/

  QUnit.config.asyncRetries = 10;
  QUnit.config.hidepassed = true;

  if (!document) {
    QUnit.config.noglobals = true;
    QUnit.load();
  }
}.call(this));
