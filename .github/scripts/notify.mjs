// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};
var compose = function(dict) {
  return dict.compose;
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;
// output/Data.Function/index.js
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0;i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Unit/foreign.js
var unit = undefined;
// output/Type.Proxy/index.js
var $$Proxy = /* @__PURE__ */ function() {
  function $$Proxy2() {}
  $$Proxy2.value = new $$Proxy2;
  return $$Proxy2;
}();

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var voidRight = function(dictFunctor) {
  var map1 = map(dictFunctor);
  return function(x) {
    return map1($$const(x));
  };
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var apply = function(dict) {
  return dict.apply;
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map2 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map2($$const(identity2))(a))(b);
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var liftA1 = function(dictApplicative) {
  var apply2 = apply(dictApplicative.Apply0());
  var pure1 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply2(pure1(f))(a);
    };
  };
};

// output/Control.Bind/foreign.js
var arrayBind = typeof Array.prototype.flatMap === "function" ? function(arr) {
  return function(f) {
    return arr.flatMap(f);
  };
} : function(arr) {
  return function(f) {
    var result = [];
    var l = arr.length;
    for (var i = 0;i < l; i++) {
      var xs = f(arr[i]);
      var k = xs.length;
      for (var j = 0;j < k; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
};
// output/Control.Bind/index.js
var discard = function(dict) {
  return dict.discard;
};
var bind = function(dict) {
  return dict.bind;
};
var bindFlipped = function(dictBind) {
  return flip(bind(dictBind));
};
var composeKleisliFlipped = function(dictBind) {
  var bindFlipped1 = bindFlipped(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bindFlipped1(f)(g(a));
      };
    };
  };
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};

// output/Data.Array/foreign.js
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0;i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons(head, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr, xs) {
    return listToArray(foldr(curryCons)(emptyList)(xs));
  };
}();
var unconsImpl = function(empty, next, xs) {
  return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
};
var sortByImpl = function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare, fromOrdering, xs) {
    var out;
    if (xs.length < 2)
      return xs;
    out = xs.slice(0);
    mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
}();
var anyImpl = function(p, xs) {
  var len = xs.length;
  for (var i = 0;i < len; i++) {
    if (p(xs[i]))
      return true;
  }
  return false;
};

// output/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output/Data.Symbol/index.js
var reflectSymbol = function(dict) {
  return dict.reflectSymbol;
};

// output/Record.Unsafe/foreign.js
var unsafeHas = function(label) {
  return function(rec) {
    return {}.hasOwnProperty.call(rec, label);
  };
};
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};
var unsafeSet = function(label) {
  return function(value) {
    return function(rec) {
      var copy = {};
      for (var key in rec) {
        if ({}.hasOwnProperty.call(rec, key)) {
          copy[key] = rec[key];
        }
      }
      copy[label] = value;
      return copy;
    };
  };
};
var unsafeDelete = function(label) {
  return function(rec) {
    var copy = {};
    for (var key in rec) {
      if (key !== label && {}.hasOwnProperty.call(rec, key)) {
        copy[key] = rec[key];
      }
    }
    return copy;
  };
};
// output/Data.Semigroup/index.js
var semigroupUnit = {
  append: function(v) {
    return function(v1) {
      return unit;
    };
  }
};
var semigroupString = {
  append: concatString
};
var semigroupArray = {
  append: concatArray
};
var append = function(dict) {
  return dict.append;
};
// output/Control.Alt/index.js
var alt = function(dict) {
  return dict.alt;
};
// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind2 = bind(dictMonad.Bind1());
  var pure2 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind2(f)(function(f$prime) {
        return bind2(a)(function(a$prime) {
          return pure2(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;
// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};

// output/Data.Show/index.js
var showInt = {
  show: showIntImpl
};
var showBoolean = {
  show: function(v) {
    if (v) {
      return "true";
    }
    if (!v) {
      return "false";
    }
    throw new Error("Failed pattern match at Data.Show (line 29, column 1 - line 31, column 23): " + [v.constructor.name]);
  }
};
var show = function(dict) {
  return dict.show;
};

// output/Data.Maybe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {}
  Nothing2.value = new Nothing2;
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe$prime = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v(unit);
      }
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      return Nothing.value;
    };
  }
};
var fromMaybe$prime = function(a) {
  return maybe$prime(a)(identity3);
};
var fromMaybe = function(a) {
  return maybe(a)(identity3);
};
var altMaybe = {
  alt: function(v) {
    return function(v1) {
      if (v instanceof Nothing) {
        return v1;
      }
      return v;
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var functorEither = {
  map: function(f) {
    return function(m) {
      if (m instanceof Left) {
        return new Left(m.value0);
      }
      if (m instanceof Right) {
        return new Right(f(m.value0));
      }
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var map2 = /* @__PURE__ */ map(functorEither);
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var hush = /* @__PURE__ */ function() {
  return either($$const(Nothing.value))(Just.create);
}();
var applyEither = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return new Left(v.value0);
      }
      if (v instanceof Right) {
        return map2(v.value0)(v1);
      }
      throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorEither;
  }
};
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();

// output/Data.Identity/index.js
var Identity = function(x) {
  return x;
};
var functorIdentity = {
  map: function(f) {
    return function(m) {
      return f(m);
    };
  }
};
var applyIdentity = {
  apply: function(v) {
    return function(v1) {
      return v(v1);
    };
  },
  Functor0: function() {
    return functorIdentity;
  }
};
var bindIdentity = {
  bind: function(v) {
    return function(f) {
      return f(v);
    };
  },
  Apply0: function() {
    return applyIdentity;
  }
};
var applicativeIdentity = {
  pure: Identity,
  Apply0: function() {
    return applyIdentity;
  }
};
var monadIdentity = {
  Applicative0: function() {
    return applicativeIdentity;
  },
  Bind1: function() {
    return bindIdentity;
  }
};
// output/Data.Monoid/index.js
var monoidUnit = {
  mempty: unit,
  Semigroup0: function() {
    return semigroupUnit;
  }
};
var mempty = function(dict) {
  return dict.mempty;
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name, moduleName, init) {
  var state = 0;
  var val;
  return function(lineNumber) {
    if (state === 2)
      return val;
    if (state === 1)
      throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state = 1;
    val = init();
    state = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
// output/Control.Monad.Rec.Class/index.js
var Loop = /* @__PURE__ */ function() {
  function Loop2(value0) {
    this.value0 = value0;
  }
  Loop2.create = function(value0) {
    return new Loop2(value0);
  };
  return Loop2;
}();
var Done = /* @__PURE__ */ function() {
  function Done2(value0) {
    this.value0 = value0;
  }
  Done2.create = function(value0) {
    return new Done2(value0);
  };
  return Done2;
}();
var tailRecM = function(dict) {
  return dict.tailRecM;
};
// output/Data.Array.ST/foreign.js
function unsafeFreezeThawImpl(xs) {
  return xs;
}
var unsafeFreezeImpl = unsafeFreezeThawImpl;
function copyImpl(xs) {
  return xs.slice();
}
var thawImpl = copyImpl;
var sortByImpl2 = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2, fromOrdering, xs) {
    if (xs.length < 2)
      return xs;
    mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
    return xs;
  };
}();
var pushImpl = function(a, xs) {
  return xs.push(a);
};

// output/Control.Monad.ST.Uncurried/foreign.js
var runSTFn1 = function runSTFn12(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};
var runSTFn2 = function runSTFn22(fn) {
  return function(a) {
    return function(b) {
      return function() {
        return fn(a, b);
      };
    };
  };
};
// output/Data.Array.ST/index.js
var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
var withArray = function(f) {
  return function(xs) {
    return function __do() {
      var result = thaw(xs)();
      f(result)();
      return unsafeFreeze(result)();
    };
  };
};
var push = /* @__PURE__ */ runSTFn2(pushImpl);

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1;i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0;i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};
// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
};
// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var fst = function(v) {
  return v.value0;
};

// output/Data.Bifunctor/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var lmap = function(dictBifunctor) {
  var bimap1 = bimap(dictBifunctor);
  return function(f) {
    return bimap1(f)(identity4);
  };
};
var bifunctorEither = {
  bimap: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return new Left(v(v2.value0));
        }
        if (v2 instanceof Right) {
          return new Right(v1(v2.value0));
        }
        throw new Error("Failed pattern match at Data.Bifunctor (line 38, column 1 - line 40, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  }
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};
// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var unwrap = function() {
  return coerce2;
};
var unwrap1 = /* @__PURE__ */ unwrap();
var un = function() {
  return function(v) {
    return unwrap1;
  };
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure2 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr2 = foldr(dictFoldable);
    return function(f) {
      return foldr2(function($454) {
        return applySecond2(f($454));
      })(pure2(unit));
    };
  };
};
var foldl = function(dict) {
  return dict.foldl;
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr2 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldr2(function(x) {
        return function(acc) {
          return append2(f(x))(acc);
        };
      })(mempty2);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};
var foldMap = function(dict) {
  return dict.foldMap;
};
var foldM = function(dictFoldable) {
  var foldl2 = foldl(dictFoldable);
  return function(dictMonad) {
    var bind2 = bind(dictMonad.Bind1());
    var pure2 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(b0) {
        return foldl2(function(b) {
          return function(a) {
            return bind2(b)(flip(f)(a));
          };
        })(pure2(b0));
      };
    };
  };
};

// output/Data.Function.Uncurried/foreign.js
var runFn2 = function(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
};
var runFn3 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};
// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply2) {
    return function(map3) {
      return function(pure2) {
        return function(f) {
          return function(array) {
            function go(bot, top2) {
              switch (top2 - bot) {
                case 0:
                  return pure2([]);
                case 1:
                  return map3(array1)(f(array[bot]));
                case 2:
                  return apply2(map3(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply2(apply2(map3(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                  return apply2(map3(concat2)(go(bot, pivot)))(go(pivot, top2));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();
// output/Data.Semigroup.Foldable/index.js
var JoinWith = function(x) {
  return x;
};
var semigroupJoinWith = function(dictSemigroup) {
  var append2 = append(dictSemigroup);
  return {
    append: function(v) {
      return function(v1) {
        return function(j) {
          return append2(v(j))(append2(j)(v1(j)));
        };
      };
    }
  };
};
var joinee = function(v) {
  return v;
};
var foldMap1 = function(dict) {
  return dict.foldMap1;
};
var intercalateMap = function(dictFoldable1) {
  var foldMap11 = foldMap1(dictFoldable1);
  return function(dictSemigroup) {
    var foldMap12 = foldMap11(semigroupJoinWith(dictSemigroup));
    return function(j) {
      return function(f) {
        return function(foldable) {
          return joinee(foldMap12(function($171) {
            return JoinWith($$const(f($171)));
          })(foldable))(j);
        };
      };
    };
  };
};
// output/Data.Array/index.js
var uncons = /* @__PURE__ */ function() {
  return runFn3(unconsImpl)($$const(Nothing.value))(function(x) {
    return function(xs) {
      return new Just({
        head: x,
        tail: xs
      });
    };
  });
}();
var snoc = function(xs) {
  return function(x) {
    return withArray(push(x))(xs)();
  };
};
var any2 = /* @__PURE__ */ runFn2(anyImpl);

// output/Data.String.CodeUnits/foreign.js
var length2 = function(s) {
  return s.length;
};
var splitAt = function(i) {
  return function(s) {
    return { before: s.substring(0, i), after: s.substring(i) };
  };
};
// output/Data.String.CodeUnits/index.js
var stripSuffix = function(v) {
  return function(str) {
    var v1 = splitAt(length2(str) - length2(v) | 0)(str);
    var $14 = v1.after === v;
    if ($14) {
      return new Just(v1.before);
    }
    return Nothing.value;
  };
};
var stripPrefix = function(v) {
  return function(str) {
    var v1 = splitAt(length2(v))(str);
    var $20 = v1.before === v;
    if ($20) {
      return new Just(v1.after);
    }
    return Nothing.value;
  };
};

// output/Data.String.Common/foreign.js
var replaceAll = function(s1) {
  return function(s2) {
    return function(s3) {
      return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
    };
  };
};
var split = function(sep) {
  return function(s) {
    return s.split(sep);
  };
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};
// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler(error) {
    return new Aff2(PURE, undefined);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error) {
      setTimeout(function() {
        throw error;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error) {
      return left(error);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error) {
      k(left(error))();
      return nonCanceler;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size !== 0) {
        size--;
        thunk = queue[ix];
        queue[ix] = undefined;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size) % limit] = cb;
        size++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step = aff;
    var fail = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run3(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail = step;
              step = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step._2;
                status = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step = util.right(step._1);
                } else {
                  status = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status = PENDING;
                step = runAsync(util.left, step._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step = result2;
                      run3(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step = sequential(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step = interrupt || fail || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail) {
                    status = CONTINUE;
                    step = attempt._2(util.fromLeft(fail));
                    fail = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail === null) {
                    result = util.fromRight(step);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail) {
                    step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step = attempt._1;
                  fail = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail) {
              setTimeout(function() {
                throw util.fromLeft(fail);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join3) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join3.rethrow;
          join3.handler(step)();
          return function() {};
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join3;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(undefined))();
          return function() {};
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(undefined));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error);
            status = COMPLETED;
            step = interrupt;
            run3(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step(error)), attempts, interrupt);
              }
              status = RETURN;
              step = null;
              fail = null;
              run3(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step = null;
              fail = null;
            }
        }
        return canceler;
      };
    }
    function join2(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run3(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join: join2,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run3(runTick);
            });
          } else {
            run3(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error, par2, cb2) {
      var step = par2;
      var head = null;
      var tail = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills2[count++] = tmp.kill(error, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff2(CONS, head, tail);
              }
              head = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(undefined))();
      } else {
        kid = 0;
        tmp = count;
        for (;kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join2(result, head, tail) {
      var fail, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail = result;
        step = null;
      } else {
        step = result;
        fail = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail || step)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail === null) {
                head._3 = util.right(head._1(util.fromRight(step)));
                step = head._3;
              } else {
                head._3 = fail;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail) {
                head._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(fail, null, null);
                    } else {
                      join2(fail, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step === lhs ? rhs : lhs;
                step = null;
                head._3 = fail;
              } else {
                head._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(step, null, null);
                    } else {
                      join2(step, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join2(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run3() {
      var status = CONTINUE;
      var step = par;
      var head = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step;
                  step = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step;
                status = CONTINUE;
                step = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step;
                step = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step;
      for (fid = 0;fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error, cb2) {
      interrupt = util.left(error);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler;
          };
        });
      };
    }
    run3();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
function _parAffMap(f) {
  return function(aff) {
    return Aff.ParMap(f, aff);
  };
}
function _parAffApply(aff1) {
  return function(aff2) {
    return Aff.ParApply(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output/Effect.Exception/foreign.js
function error(msg) {
  return new Error(msg);
}
function message(e) {
  return e.message;
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}

// output/Effect.Exception/index.js
var pure2 = /* @__PURE__ */ pure(applicativeEffect);
var map3 = /* @__PURE__ */ map(functorEffect);
var $$try = function(action) {
  return catchException(function($3) {
    return pure2(Left.create($3));
  })(map3(Right.create)(action));
};

// output/Control.Monad.Error.Class/index.js
var throwError = function(dict) {
  return dict.throwError;
};
var catchError = function(dict) {
  return dict.catchError;
};
var $$try2 = function(dictMonadError) {
  var catchError1 = catchError(dictMonadError);
  var Monad0 = dictMonadError.MonadThrow0().Monad0();
  var map4 = map(Monad0.Bind1().Apply0().Functor0());
  var pure3 = pure(Monad0.Applicative0());
  return function(a) {
    return catchError1(map4(Right.create)(a))(function($52) {
      return pure3(Left.create($52));
    });
  };
};

// output/Control.Monad.Reader.Class/index.js
var ask = function(dict) {
  return dict.ask;
};

// output/Control.Monad.Trans.Class/index.js
var lift = function(dict) {
  return dict.lift;
};

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};
// output/Control.Monad.Except.Trans/index.js
var map4 = /* @__PURE__ */ map(functorEither);
var ExceptT = function(x) {
  return x;
};
var withExceptT = function(dictFunctor) {
  var map1 = map(dictFunctor);
  return function(f) {
    return function(v) {
      var mapLeft = function(v1) {
        return function(v2) {
          if (v2 instanceof Right) {
            return new Right(v2.value0);
          }
          if (v2 instanceof Left) {
            return new Left(v1(v2.value0));
          }
          throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 43, column 3 - line 43, column 32): " + [v1.constructor.name, v2.constructor.name]);
        };
      };
      return map1(mapLeft(f))(v);
    };
  };
};
var runExceptT = function(v) {
  return v;
};
var mapExceptT = function(f) {
  return function(v) {
    return f(v);
  };
};
var functorExceptT = function(dictFunctor) {
  var map1 = map(dictFunctor);
  return {
    map: function(f) {
      return mapExceptT(map1(map4(f)));
    }
  };
};
var except = function(dictApplicative) {
  var $191 = pure(dictApplicative);
  return function($192) {
    return ExceptT($191($192));
  };
};
var monadExceptT = function(dictMonad) {
  return {
    Applicative0: function() {
      return applicativeExceptT(dictMonad);
    },
    Bind1: function() {
      return bindExceptT(dictMonad);
    }
  };
};
var bindExceptT = function(dictMonad) {
  var bind2 = bind(dictMonad.Bind1());
  var pure3 = pure(dictMonad.Applicative0());
  return {
    bind: function(v) {
      return function(k) {
        return bind2(v)(either(function($193) {
          return pure3(Left.create($193));
        })(function(a) {
          var v1 = k(a);
          return v1;
        }));
      };
    },
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var applyExceptT = function(dictMonad) {
  var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
  return {
    apply: ap(monadExceptT(dictMonad)),
    Functor0: function() {
      return functorExceptT1;
    }
  };
};
var applicativeExceptT = function(dictMonad) {
  return {
    pure: function() {
      var $194 = pure(dictMonad.Applicative0());
      return function($195) {
        return ExceptT($194(Right.create($195)));
      };
    }(),
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var monadThrowExceptT = function(dictMonad) {
  var monadExceptT1 = monadExceptT(dictMonad);
  return {
    throwError: function() {
      var $204 = pure(dictMonad.Applicative0());
      return function($205) {
        return ExceptT($204(Left.create($205)));
      };
    }(),
    Monad0: function() {
      return monadExceptT1;
    }
  };
};
// output/Control.Parallel.Class/index.js
var sequential = function(dict) {
  return dict.sequential;
};
var parallel = function(dict) {
  return dict.parallel;
};

// output/Control.Parallel/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var parTraverse_ = function(dictParallel) {
  var sequential2 = sequential(dictParallel);
  var parallel2 = parallel(dictParallel);
  return function(dictApplicative) {
    var traverse_2 = traverse_(dictApplicative);
    return function(dictFoldable) {
      var traverse_1 = traverse_2(dictFoldable);
      return function(f) {
        var $51 = traverse_1(function($53) {
          return parallel2(f($53));
        });
        return function($52) {
          return sequential2($51($52));
        };
      };
    };
  };
};
var parSequence_ = function(dictParallel) {
  var parTraverse_1 = parTraverse_(dictParallel);
  return function(dictApplicative) {
    var parTraverse_2 = parTraverse_1(dictApplicative);
    return function(dictFoldable) {
      return parTraverse_2(dictFoldable)(identity5);
    };
  };
};

// output/Effect.Unsafe/foreign.js
var unsafePerformEffect = function(f) {
  return f();
};
// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Effect.Aff/index.js
var $runtime_lazy2 = function(name2, moduleName, init) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init();
    state2 = 2;
    return val;
  };
};
var functorParAff = {
  map: _parAffMap
};
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    if (v instanceof Right) {
      return false;
    }
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var applyParAff = {
  apply: _parAffApply,
  Functor0: function() {
    return functorParAff;
  }
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
var pure22 = /* @__PURE__ */ pure(applicativeAff);
var bind1 = /* @__PURE__ */ bind(bindAff);
var parallelAff = {
  parallel: unsafeCoerce2,
  sequential: _sequential,
  Apply0: function() {
    return applyAff;
  },
  Apply1: function() {
    return applyParAff;
  }
};
var parallel2 = /* @__PURE__ */ parallel(parallelAff);
var applicativeParAff = {
  pure: function($76) {
    return parallel2(pure22($76));
  },
  Apply0: function() {
    return applyParAff;
  }
};
var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableArray);
var semigroupCanceler = {
  append: function(v) {
    return function(v1) {
      return function(err) {
        return parSequence_2([v(err), v1(err)]);
      };
    };
  }
};
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};
var monadThrowAff = {
  throwError: _throwError,
  Monad0: function() {
    return monadAff;
  }
};
var monadErrorAff = {
  catchError: _catchError,
  MonadThrow0: function() {
    return monadThrowAff;
  }
};
var monadRecAff = {
  tailRecM: function(k) {
    var go = function(a) {
      return bind1(k(a))(function(res) {
        if (res instanceof Done) {
          return pure22(res.value0);
        }
        if (res instanceof Loop) {
          return go(res.value0);
        }
        throw new Error("Failed pattern match at Effect.Aff (line 104, column 7 - line 106, column 23): " + [res.constructor.name]);
      });
    };
    return go;
  },
  Monad0: function() {
    return monadAff;
  }
};
var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));
var monoidCanceler = {
  mempty: nonCanceler,
  Semigroup0: function() {
    return semigroupCanceler;
  }
};

// output/Effect.Console/foreign.js
var error2 = function(s) {
  return function() {
    console.error(s);
  };
};
// output/Effect.Class.Console/index.js
var error3 = function(dictMonadEffect) {
  var $79 = liftEffect(dictMonadEffect);
  return function($80) {
    return $79(error2($80));
  };
};

// output/Node.Process/foreign.js
import process from "process";
var abortImpl = process.abort ? () => process.abort() : null;
var channelRefImpl = process.channel && process.channel.ref ? () => process.channel.ref() : null;
var channelUnrefImpl = process.channel && process.channel.unref ? () => process.channel.unref() : null;
var debugPort = process.debugPort;
var disconnectImpl = process.disconnect ? () => process.disconnect() : null;
var unsafeGetEnv = () => process.env;
var pid = process.pid;
var platformStr = process.platform;
var ppid = process.ppid;
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var stdinIsTTY = process.stdinIsTTY;
var stdoutIsTTY = process.stdoutIsTTY;
var stderrIsTTY = process.stderrIsTTY;
var version = process.version;
// output/Effect.Uncurried/foreign.js
var mkEffectFn1 = function mkEffectFn12(fn) {
  return function(x) {
    return fn(x)();
  };
};
var runEffectFn1 = function runEffectFn12(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};
// output/Foreign.Object/foreign.js
function _lookup(no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});
// output/Foreign.Object/index.js
var lookup = /* @__PURE__ */ function() {
  return runFn4(_lookup)(Nothing.value)(Just.create);
}();
// output/Node.Process/index.js
var map5 = /* @__PURE__ */ map(functorEffect);
var lookupEnv = function(k) {
  return map5(lookup(k))(unsafeGetEnv);
};

// output/JS.Fetch.Headers/foreign.js
function unsafeNew() {
  return new Headers;
}
function unsafeAppend(key, value, headers) {
  return headers.append(key, value);
}
function _toArray(tuple, headers) {
  return Array.from(headers.entries(), function(pair) {
    return tuple(pair[0])(pair[1]);
  });
}

// output/JS.Fetch.Headers/index.js
var toArray = /* @__PURE__ */ function() {
  return runFn2(_toArray)(Tuple.create);
}();
var fromFoldable2 = function(dictFoldable) {
  var foldM2 = foldM(dictFoldable)(monadEffect);
  return function(f) {
    return unsafePerformEffect(function __do() {
      var init = unsafeNew();
      return foldM2(function(headers) {
        return function(v) {
          return function __do() {
            unsafeAppend(v.value0, v.value1, headers);
            return headers;
          };
        };
      })(init)(f)();
    });
  };
};
var empty3 = /* @__PURE__ */ fromFoldable2(foldableArray)([]);
// output/Record/index.js
var insert = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function() {
      return function(l) {
        return function(a) {
          return function(r) {
            return unsafeSet(reflectSymbol2(l))(a)(r);
          };
        };
      };
    };
  };
};
var get = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r) {
        return unsafeGet(reflectSymbol2(l))(r);
      };
    };
  };
};
var $$delete = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function() {
      return function(l) {
        return function(r) {
          return unsafeDelete(reflectSymbol2(l))(r);
        };
      };
    };
  };
};

// output/Yoga.Fetch.Om.BuildUrl/foreign.js
function encodeURIComponent_(s) {
  return encodeURIComponent(s);
}

// output/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
// output/Data.Int/index.js
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();

// output/Yoga.HTTP.API.Path/index.js
var pathPatternSegsParam = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return {
    pathPatternSegs: function(v) {
      return "/:" + reflectSymbol2($$Proxy.value);
    }
  };
};
var pathPatternSegs = function(dict) {
  return dict.pathPatternSegs;
};
var pathPatternSegsParamCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function(dictPathPatternSegs) {
    var pathPatternSegs1 = pathPatternSegs(dictPathPatternSegs);
    return {
      pathPatternSegs: function(v) {
        return "/:" + (reflectSymbol2($$Proxy.value) + pathPatternSegs1($$Proxy.value));
      }
    };
  };
};
var pathPatternSegsSymbolCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function(dictPathPatternSegs) {
    var pathPatternSegs1 = pathPatternSegs(dictPathPatternSegs);
    return {
      pathPatternSegs: function(v) {
        return "/" + (reflectSymbol2($$Proxy.value) + pathPatternSegs1($$Proxy.value));
      }
    };
  };
};
var pathPatternBare = function(dictPathPatternSegs) {
  var pathPatternSegs1 = pathPatternSegs(dictPathPatternSegs);
  return {
    pathPattern: function(v) {
      return pathPatternSegs1($$Proxy.value);
    }
  };
};
var pathPattern = function(dict) {
  return dict.pathPattern;
};
var pathPatternQueryParams = function(dictPathPattern) {
  var pathPattern1 = pathPattern(dictPathPattern);
  return {
    pathPattern: function(v) {
      return pathPattern1($$Proxy.value);
    }
  };
};

// output/Yoga.Fetch.Om.BuildUrl/index.js
var substitutePathParamsRLNil = {
  substitutePathParamsRL: function(v) {
    return function(v1) {
      return function(url) {
        return url;
      };
    };
  }
};
var serializeParamBoolean = {
  serializeParam: /* @__PURE__ */ show(showBoolean)
};
var appendQueryParamsRLNil = {
  appendQueryParamsRL: function(v) {
    return function(v1) {
      return function(acc) {
        return acc;
      };
    };
  }
};
var substitutePathParamsRL = function(dict) {
  return dict.substitutePathParamsRL;
};
var substitutePathParams1 = function() {
  return function(dictSubstitutePathParamsRL) {
    var substitutePathParamsRL1 = substitutePathParamsRL(dictSubstitutePathParamsRL);
    return {
      substitutePathParamsImpl: function(v) {
        return substitutePathParamsRL1($$Proxy.value);
      }
    };
  };
};
var substitutePathParamsImpl = function(dict) {
  return dict.substitutePathParamsImpl;
};
var serializeParam = function(dict) {
  return dict.serializeParam;
};
var substitutePathParamsRLCon = function(dictIsSymbol) {
  var get2 = get(dictIsSymbol)();
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function(dictSerializeParam) {
    var serializeParam1 = serializeParam(dictSerializeParam);
    return function(dictSubstitutePathParamsRL) {
      var substitutePathParamsRL1 = substitutePathParamsRL(dictSubstitutePathParamsRL);
      return function() {
        return {
          substitutePathParamsRL: function(v) {
            return function(rec) {
              return function(url) {
                var value = get2($$Proxy.value)(rec);
                var pattern = ":" + reflectSymbol2($$Proxy.value);
                var replaced = replaceAll(pattern)(serializeParam1(value))(url);
                return substitutePathParamsRL1($$Proxy.value)(rec)(replaced);
              };
            };
          }
        };
      };
    };
  };
};
var buildUrl = function(dict) {
  return dict.buildUrl;
};
var appendQueryParamsRL = function(dict) {
  return dict.appendQueryParamsRL;
};
var appendQueryParams1 = function() {
  return function(dictAppendQueryParamsRL) {
    var appendQueryParamsRL1 = appendQueryParamsRL(dictAppendQueryParamsRL);
    return {
      appendQueryParamsImpl: function(v) {
        return function(rec) {
          return function(url) {
            var pairs = appendQueryParamsRL1($$Proxy.value)(rec)([]);
            var queryString = function() {
              if (pairs.length === 0) {
                return "";
              }
              return "?" + joinWith("&")(pairs);
            }();
            return url + queryString;
          };
        };
      }
    };
  };
};
var appendQueryParamsRLConsMa = function(dictIsSymbol) {
  var get2 = get(dictIsSymbol)();
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function(dictSerializeParam) {
    var serializeParam1 = serializeParam(dictSerializeParam);
    return function(dictAppendQueryParamsRL) {
      var appendQueryParamsRL1 = appendQueryParamsRL(dictAppendQueryParamsRL);
      return function() {
        return {
          appendQueryParamsRL: function(v) {
            return function(rec) {
              return function(acc) {
                var acc$prime = function() {
                  var v1 = get2($$Proxy.value)(rec);
                  if (v1 instanceof Nothing) {
                    return acc;
                  }
                  if (v1 instanceof Just) {
                    return snoc(acc)(encodeURIComponent_(reflectSymbol2($$Proxy.value)) + ("=" + encodeURIComponent_(serializeParam1(v1.value0))));
                  }
                  throw new Error("Failed pattern match at Yoga.Fetch.Om.BuildUrl (line 125, column 12 - line 127, column 144): " + [v1.constructor.name]);
                }();
                return appendQueryParamsRL1($$Proxy.value)(rec)(acc$prime);
              };
            };
          }
        };
      };
    };
  };
};
var appendQueryParamsImpl = function(dict) {
  return dict.appendQueryParamsImpl;
};
var buildUrl1 = function(dictPathPattern) {
  var pathPattern2 = pathPattern(dictPathPattern);
  return function(dictSubstitutePathParams) {
    var substitutePathParamsImpl1 = substitutePathParamsImpl(dictSubstitutePathParams);
    return function(dictAppendQueryParams) {
      var appendQueryParamsImpl1 = appendQueryParamsImpl(dictAppendQueryParams);
      return {
        buildUrl: function(baseUrl) {
          return function(segmentsProxy) {
            return function(pathParamsRec) {
              return function(queryParamsRec) {
                var pattern = pathPattern2(segmentsProxy);
                var dropTrailingSlash = function($copy_s) {
                  var $tco_done = false;
                  var $tco_result;
                  function $tco_loop(s) {
                    var v = stripSuffix("/")(s);
                    if (v instanceof Just) {
                      $copy_s = v.value0;
                      return;
                    }
                    if (v instanceof Nothing) {
                      $tco_done = true;
                      return s;
                    }
                    throw new Error("Failed pattern match at Yoga.Fetch.Om.BuildUrl (line 50, column 27 - line 52, column 19): " + [v.constructor.name]);
                  }
                  while (!$tco_done) {
                    $tco_result = $tco_loop($copy_s);
                  }
                  return $tco_result;
                };
                var withBase = function() {
                  if (baseUrl === "") {
                    return pattern;
                  }
                  return dropTrailingSlash(baseUrl) + pattern;
                }();
                var withPathParams = substitutePathParamsImpl1($$Proxy.value)(pathParamsRec)(withBase);
                var withQueryParams = appendQueryParamsImpl1($$Proxy.value)(queryParamsRec)(withPathParams);
                return withQueryParams;
              };
            };
          };
        }
      };
    };
  };
};

// output/Yoga.Fetch.Om.ClientFunction/index.js
var buildClientFnConsNilIsNot = {
  buildClientFn: function(v) {
    return function(v1) {
      return function(v2) {
        return function(f) {
          return function(pqr) {
            return function(b) {
              return f(pqr)({})(b);
            };
          };
        };
      };
    };
  }
};
var buildClientFn = function(dict) {
  return dict.buildClientFn;
};

// output/Data.HTTP.Method/index.js
var OPTIONS = /* @__PURE__ */ function() {
  function OPTIONS2() {}
  OPTIONS2.value = new OPTIONS2;
  return OPTIONS2;
}();
var GET = /* @__PURE__ */ function() {
  function GET2() {}
  GET2.value = new GET2;
  return GET2;
}();
var HEAD = /* @__PURE__ */ function() {
  function HEAD2() {}
  HEAD2.value = new HEAD2;
  return HEAD2;
}();
var POST = /* @__PURE__ */ function() {
  function POST2() {}
  POST2.value = new POST2;
  return POST2;
}();
var PUT = /* @__PURE__ */ function() {
  function PUT2() {}
  PUT2.value = new PUT2;
  return PUT2;
}();
var DELETE = /* @__PURE__ */ function() {
  function DELETE2() {}
  DELETE2.value = new DELETE2;
  return DELETE2;
}();
var TRACE = /* @__PURE__ */ function() {
  function TRACE2() {}
  TRACE2.value = new TRACE2;
  return TRACE2;
}();
var CONNECT = /* @__PURE__ */ function() {
  function CONNECT2() {}
  CONNECT2.value = new CONNECT2;
  return CONNECT2;
}();
var PROPFIND = /* @__PURE__ */ function() {
  function PROPFIND2() {}
  PROPFIND2.value = new PROPFIND2;
  return PROPFIND2;
}();
var PROPPATCH = /* @__PURE__ */ function() {
  function PROPPATCH2() {}
  PROPPATCH2.value = new PROPPATCH2;
  return PROPPATCH2;
}();
var MKCOL = /* @__PURE__ */ function() {
  function MKCOL2() {}
  MKCOL2.value = new MKCOL2;
  return MKCOL2;
}();
var COPY = /* @__PURE__ */ function() {
  function COPY2() {}
  COPY2.value = new COPY2;
  return COPY2;
}();
var MOVE = /* @__PURE__ */ function() {
  function MOVE2() {}
  MOVE2.value = new MOVE2;
  return MOVE2;
}();
var LOCK = /* @__PURE__ */ function() {
  function LOCK2() {}
  LOCK2.value = new LOCK2;
  return LOCK2;
}();
var UNLOCK = /* @__PURE__ */ function() {
  function UNLOCK2() {}
  UNLOCK2.value = new UNLOCK2;
  return UNLOCK2;
}();
var PATCH = /* @__PURE__ */ function() {
  function PATCH2() {}
  PATCH2.value = new PATCH2;
  return PATCH2;
}();
var showMethod = {
  show: function(v) {
    if (v instanceof OPTIONS) {
      return "OPTIONS";
    }
    if (v instanceof GET) {
      return "GET";
    }
    if (v instanceof HEAD) {
      return "HEAD";
    }
    if (v instanceof POST) {
      return "POST";
    }
    if (v instanceof PUT) {
      return "PUT";
    }
    if (v instanceof DELETE) {
      return "DELETE";
    }
    if (v instanceof TRACE) {
      return "TRACE";
    }
    if (v instanceof CONNECT) {
      return "CONNECT";
    }
    if (v instanceof PROPFIND) {
      return "PROPFIND";
    }
    if (v instanceof PROPPATCH) {
      return "PROPPATCH";
    }
    if (v instanceof MKCOL) {
      return "MKCOL";
    }
    if (v instanceof COPY) {
      return "COPY";
    }
    if (v instanceof MOVE) {
      return "MOVE";
    }
    if (v instanceof LOCK) {
      return "LOCK";
    }
    if (v instanceof UNLOCK) {
      return "UNLOCK";
    }
    if (v instanceof PATCH) {
      return "PATCH";
    }
    throw new Error("Failed pattern match at Data.HTTP.Method (line 43, column 1 - line 59, column 23): " + [v.constructor.name]);
  }
};

// output/JS.Fetch/foreign.js
function _fetch(a, b) {
  return fetch(a, b);
}

// output/JS.Fetch/index.js
var fetch2 = function(req) {
  return function() {
    return _fetch(req, {});
  };
};

// output/JS.Fetch.Duplex/index.js
var Half = /* @__PURE__ */ function() {
  function Half2() {}
  Half2.value = new Half2;
  return Half2;
}();
var Full = /* @__PURE__ */ function() {
  function Full2() {}
  Full2.value = new Full2;
  return Full2;
}();
var toString2 = function(v) {
  if (v instanceof Half) {
    return "half";
  }
  if (v instanceof Full) {
    return "full";
  }
  throw new Error("Failed pattern match at JS.Fetch.Duplex (line 13, column 12 - line 15, column 17): " + [v.constructor.name]);
};

// output/JS.Fetch.Referrer/index.js
var ReferrerNone = /* @__PURE__ */ function() {
  function ReferrerNone2() {}
  ReferrerNone2.value = new ReferrerNone2;
  return ReferrerNone2;
}();
var ReferrerClient = /* @__PURE__ */ function() {
  function ReferrerClient2() {}
  ReferrerClient2.value = new ReferrerClient2;
  return ReferrerClient2;
}();
var ReferrerUrl = /* @__PURE__ */ function() {
  function ReferrerUrl2(value0) {
    this.value0 = value0;
  }
  ReferrerUrl2.create = function(value0) {
    return new ReferrerUrl2(value0);
  };
  return ReferrerUrl2;
}();
var toString3 = function(v) {
  if (v instanceof ReferrerNone) {
    return "none";
  }
  if (v instanceof ReferrerClient) {
    return "client";
  }
  if (v instanceof ReferrerUrl) {
    return v.value0;
  }
  throw new Error("Failed pattern match at JS.Fetch.Referrer (line 9, column 12 - line 12, column 25): " + [v.constructor.name]);
};

// output/JS.Fetch.ReferrerPolicy/index.js
var Default = /* @__PURE__ */ function() {
  function Default2() {}
  Default2.value = new Default2;
  return Default2;
}();
var NoReferrer = /* @__PURE__ */ function() {
  function NoReferrer2() {}
  NoReferrer2.value = new NoReferrer2;
  return NoReferrer2;
}();
var NoReferrerWhenDowngrade = /* @__PURE__ */ function() {
  function NoReferrerWhenDowngrade2() {}
  NoReferrerWhenDowngrade2.value = new NoReferrerWhenDowngrade2;
  return NoReferrerWhenDowngrade2;
}();
var SameOrigin = /* @__PURE__ */ function() {
  function SameOrigin2() {}
  SameOrigin2.value = new SameOrigin2;
  return SameOrigin2;
}();
var StrictOrigin = /* @__PURE__ */ function() {
  function StrictOrigin2() {}
  StrictOrigin2.value = new StrictOrigin2;
  return StrictOrigin2;
}();
var OriginWhenCrossOrigin = /* @__PURE__ */ function() {
  function OriginWhenCrossOrigin2() {}
  OriginWhenCrossOrigin2.value = new OriginWhenCrossOrigin2;
  return OriginWhenCrossOrigin2;
}();
var StrictOriginWhenCrossOrigin = /* @__PURE__ */ function() {
  function StrictOriginWhenCrossOrigin2() {}
  StrictOriginWhenCrossOrigin2.value = new StrictOriginWhenCrossOrigin2;
  return StrictOriginWhenCrossOrigin2;
}();
var UnsafeUrl = /* @__PURE__ */ function() {
  function UnsafeUrl2() {}
  UnsafeUrl2.value = new UnsafeUrl2;
  return UnsafeUrl2;
}();
var toString4 = function(v) {
  if (v instanceof Default) {
    return "";
  }
  if (v instanceof NoReferrer) {
    return "no-referrer";
  }
  if (v instanceof NoReferrerWhenDowngrade) {
    return "no-referrer-when-downgrade";
  }
  if (v instanceof SameOrigin) {
    return "same-origin";
  }
  if (v instanceof StrictOrigin) {
    return "strict-origin";
  }
  if (v instanceof OriginWhenCrossOrigin) {
    return "origin-when-cross-origin";
  }
  if (v instanceof StrictOriginWhenCrossOrigin) {
    return "strict-origin-when-cross-origin";
  }
  if (v instanceof UnsafeUrl) {
    return "unsafe-url";
  }
  throw new Error("Failed pattern match at JS.Fetch.ReferrerPolicy (line 16, column 12 - line 24, column 28): " + [v.constructor.name]);
};

// output/JS.Fetch.Request/foreign.js
function _unsafeNew(url, options) {
  try {
    return new Request(url, options);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// output/JS.Fetch.Integrity/index.js
var Integrity = function(x) {
  return x;
};

// output/JS.Fetch.RequestCache/index.js
var Default2 = /* @__PURE__ */ function() {
  function Default3() {}
  Default3.value = new Default3;
  return Default3;
}();
var NoStore = /* @__PURE__ */ function() {
  function NoStore2() {}
  NoStore2.value = new NoStore2;
  return NoStore2;
}();
var Reload = /* @__PURE__ */ function() {
  function Reload2() {}
  Reload2.value = new Reload2;
  return Reload2;
}();
var NoCache = /* @__PURE__ */ function() {
  function NoCache2() {}
  NoCache2.value = new NoCache2;
  return NoCache2;
}();
var ForceCache = /* @__PURE__ */ function() {
  function ForceCache2() {}
  ForceCache2.value = new ForceCache2;
  return ForceCache2;
}();
var OnlyIfCached = /* @__PURE__ */ function() {
  function OnlyIfCached2() {}
  OnlyIfCached2.value = new OnlyIfCached2;
  return OnlyIfCached2;
}();
var toString5 = function(v) {
  if (v instanceof Default2) {
    return "default";
  }
  if (v instanceof NoStore) {
    return "no-store";
  }
  if (v instanceof Reload) {
    return "reload";
  }
  if (v instanceof NoCache) {
    return "no-cache";
  }
  if (v instanceof ForceCache) {
    return "force-cache";
  }
  if (v instanceof OnlyIfCached) {
    return "only-if-cached";
  }
  throw new Error("Failed pattern match at JS.Fetch.RequestCache (line 14, column 12 - line 20, column 35): " + [v.constructor.name]);
};

// output/JS.Fetch.RequestCredentials/index.js
var Omit = /* @__PURE__ */ function() {
  function Omit2() {}
  Omit2.value = new Omit2;
  return Omit2;
}();
var SameOrigin2 = /* @__PURE__ */ function() {
  function SameOrigin3() {}
  SameOrigin3.value = new SameOrigin3;
  return SameOrigin3;
}();
var Include = /* @__PURE__ */ function() {
  function Include2() {}
  Include2.value = new Include2;
  return Include2;
}();
var toString6 = function(v) {
  if (v instanceof Omit) {
    return "omit";
  }
  if (v instanceof SameOrigin2) {
    return "same-origin";
  }
  if (v instanceof Include) {
    return "include";
  }
  throw new Error("Failed pattern match at JS.Fetch.RequestCredentials (line 11, column 12 - line 14, column 23): " + [v.constructor.name]);
};

// output/JS.Fetch.RequestMode/index.js
var Cors = /* @__PURE__ */ function() {
  function Cors2() {}
  Cors2.value = new Cors2;
  return Cors2;
}();
var NoCors = /* @__PURE__ */ function() {
  function NoCors2() {}
  NoCors2.value = new NoCors2;
  return NoCors2;
}();
var SameOrigin3 = /* @__PURE__ */ function() {
  function SameOrigin4() {}
  SameOrigin4.value = new SameOrigin4;
  return SameOrigin4;
}();
var Navigate = /* @__PURE__ */ function() {
  function Navigate2() {}
  Navigate2.value = new Navigate2;
  return Navigate2;
}();
var toString7 = function(v) {
  if (v instanceof Cors) {
    return "cors";
  }
  if (v instanceof NoCors) {
    return "no-cors";
  }
  if (v instanceof SameOrigin3) {
    return "same-origin";
  }
  if (v instanceof Navigate) {
    return "navigate";
  }
  throw new Error("Failed pattern match at JS.Fetch.RequestMode (line 12, column 12 - line 16, column 25): " + [v.constructor.name]);
};

// output/JS.Fetch.Request/index.js
var identity6 = /* @__PURE__ */ identity(categoryFn);
var toInternalHelperNilRow = {
  convertHelper: function(v) {
    return function(v1) {
      return {};
    };
  }
};
var toInternalConverterReques = {
  convertImpl: toString7
};
var toInternalConverterReques1 = {
  convertImpl: toString5
};
var toInternalConverterReques2 = {
  convertImpl: toString6
};
var toInternalConverterReques3 = {
  convertImpl: identity6
};
var toInternalConverterReferr = {
  convertImpl: toString4
};
var toInternalConverterReferr1 = {
  convertImpl: toString3
};
var toInternalConverterMethod = {
  convertImpl: /* @__PURE__ */ show(showMethod)
};
var toInternalConverterIntegr = {
  convertImpl: /* @__PURE__ */ un()(Integrity)
};
var toInternalConverterHeader = {
  convertImpl: identity6
};
var toInternalConverterDuplex = {
  convertImpl: toString2
};
var convertImpl = function(dict) {
  return dict.convertImpl;
};
var convertHelper = function(dict) {
  return dict.convertHelper;
};
var toInternalHelperCons = function(dictToInternalConverter) {
  var convertImpl1 = convertImpl(dictToInternalConverter);
  return function() {
    return function() {
      return function() {
        return function(dictIsSymbol) {
          var $$delete2 = $$delete(dictIsSymbol)()();
          var get2 = get(dictIsSymbol)();
          var insert2 = insert(dictIsSymbol)()();
          return function(dictToInternalHelper) {
            var convertHelper1 = convertHelper(dictToInternalHelper);
            return function() {
              return function() {
                return {
                  convertHelper: function(v) {
                    return function(r) {
                      var tail = convertHelper1($$Proxy.value)($$delete2($$Proxy.value)(r));
                      var head = convertImpl1(get2($$Proxy.value)(r));
                      return insert2($$Proxy.value)(head)(tail);
                    };
                  }
                };
              };
            };
          };
        };
      };
    };
  };
};
var toInternalRowRow = function() {
  return function() {
    return function(dictToInternalHelper) {
      return {
        convert: convertHelper(dictToInternalHelper)($$Proxy.value)
      };
    };
  };
};
var convert = function(dict) {
  return dict.convert;
};
var toUnsafeOptions = function() {
  return function() {
    return function(dictToInternal) {
      return convert(dictToInternal);
    };
  };
};
var toUnsafeOptions1 = /* @__PURE__ */ toUnsafeOptions()();
var $$new2 = function() {
  return function() {
    return function(dictToInternal) {
      var toUnsafeOptions2 = toUnsafeOptions1(dictToInternal);
      return function(url) {
        return function(options) {
          return function() {
            return _unsafeNew(url, toUnsafeOptions2(options));
          };
        };
      };
    };
  };
};

// output/JS.Fetch.RequestBody/foreign.js
function fromString3(a) {
  return a;
}
var empty4 = null;
// output/Control.Monad.Except/index.js
var unwrap2 = /* @__PURE__ */ unwrap();
var withExcept = /* @__PURE__ */ withExceptT(functorIdentity);
var runExcept = function($3) {
  return unwrap2(runExceptT($3));
};

// output/Foreign/foreign.js
function typeOf(value) {
  return typeof value;
}
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// output/Data.NonEmpty/index.js
var NonEmpty = /* @__PURE__ */ function() {
  function NonEmpty2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  NonEmpty2.create = function(value0) {
    return function(value1) {
      return new NonEmpty2(value0, value1);
    };
  };
  return NonEmpty2;
}();
var singleton3 = function(dictPlus) {
  var empty5 = empty(dictPlus);
  return function(a) {
    return new NonEmpty(a, empty5);
  };
};
var functorNonEmpty = function(dictFunctor) {
  var map22 = map(dictFunctor);
  return {
    map: function(f) {
      return function(m) {
        return new NonEmpty(f(m.value0), map22(f)(m.value1));
      };
    }
  };
};
var foldableNonEmpty = function(dictFoldable) {
  var foldMap2 = foldMap(dictFoldable);
  var foldl2 = foldl(dictFoldable);
  var foldr2 = foldr(dictFoldable);
  return {
    foldMap: function(dictMonoid) {
      var append1 = append(dictMonoid.Semigroup0());
      var foldMap12 = foldMap2(dictMonoid);
      return function(f) {
        return function(v) {
          return append1(f(v.value0))(foldMap12(f)(v.value1));
        };
      };
    },
    foldl: function(f) {
      return function(b) {
        return function(v) {
          return foldl2(f)(f(b)(v.value0))(v.value1);
        };
      };
    },
    foldr: function(f) {
      return function(b) {
        return function(v) {
          return f(v.value0)(foldr2(f)(b)(v.value1));
        };
      };
    }
  };
};
var foldable1NonEmpty = function(dictFoldable) {
  var foldl2 = foldl(dictFoldable);
  var foldr2 = foldr(dictFoldable);
  var foldableNonEmpty1 = foldableNonEmpty(dictFoldable);
  return {
    foldMap1: function(dictSemigroup) {
      var append1 = append(dictSemigroup);
      return function(f) {
        return function(v) {
          return foldl2(function(s) {
            return function(a1) {
              return append1(s)(f(a1));
            };
          })(f(v.value0))(v.value1);
        };
      };
    },
    foldr1: function(f) {
      return function(v) {
        return maybe(v.value0)(f(v.value0))(foldr2(function(a1) {
          var $250 = maybe(a1)(f(a1));
          return function($251) {
            return Just.create($250($251));
          };
        })(Nothing.value)(v.value1));
      };
    },
    foldl1: function(f) {
      return function(v) {
        return foldl2(f)(v.value0)(v.value1);
      };
    },
    Foldable0: function() {
      return foldableNonEmpty1;
    }
  };
};

// output/Data.List.Types/index.js
var Nil = /* @__PURE__ */ function() {
  function Nil2() {}
  Nil2.value = new Nil2;
  return Nil2;
}();
var Cons = /* @__PURE__ */ function() {
  function Cons2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  Cons2.create = function(value0) {
    return function(value1) {
      return new Cons2(value0, value1);
    };
  };
  return Cons2;
}();
var NonEmptyList = function(x) {
  return x;
};
var toList = function(v) {
  return new Cons(v.value0, v.value1);
};
var listMap = function(f) {
  var chunkedRevMap = function($copy_v) {
    return function($copy_v1) {
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1) {
        if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
          $tco_var_v = new Cons(v1, v);
          $copy_v1 = v1.value1.value1.value1;
          return;
        }
        var unrolledMap = function(v2) {
          if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
            return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
          }
          if (v2 instanceof Cons && v2.value1 instanceof Nil) {
            return new Cons(f(v2.value0), Nil.value);
          }
          return Nil.value;
        };
        var reverseUnrolledMap = function($copy_v2) {
          return function($copy_v3) {
            var $tco_var_v2 = $copy_v2;
            var $tco_done1 = false;
            var $tco_result2;
            function $tco_loop2(v2, v3) {
              if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                $tco_var_v2 = v2.value1;
                $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                return;
              }
              $tco_done1 = true;
              return v3;
            }
            while (!$tco_done1) {
              $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
            }
            return $tco_result2;
          };
        };
        $tco_done = true;
        return reverseUnrolledMap(v)(unrolledMap(v1));
      }
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $copy_v1);
      }
      return $tco_result;
    };
  };
  return chunkedRevMap(Nil.value);
};
var functorList = {
  map: listMap
};
var map6 = /* @__PURE__ */ map(functorList);
var functorNonEmptyList = /* @__PURE__ */ functorNonEmpty(functorList);
var foldableList = {
  foldr: function(f) {
    return function(b) {
      var rev = function() {
        var go = function($copy_v) {
          return function($copy_v1) {
            var $tco_var_v = $copy_v;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v, v1) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return v;
              }
              if (v1 instanceof Cons) {
                $tco_var_v = new Cons(v1.value0, v);
                $copy_v1 = v1.value1;
                return;
              }
              throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
            }
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v, $copy_v1);
            }
            return $tco_result;
          };
        };
        return go(Nil.value);
      }();
      var $284 = foldl(foldableList)(flip(f))(b);
      return function($285) {
        return $284(rev($285));
      };
    };
  },
  foldl: function(f) {
    var go = function($copy_b) {
      return function($copy_v) {
        var $tco_var_b = $copy_b;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(b, v) {
          if (v instanceof Nil) {
            $tco_done1 = true;
            return b;
          }
          if (v instanceof Cons) {
            $tco_var_b = f(b)(v.value0);
            $copy_v = v.value1;
            return;
          }
          throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
        }
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_b, $copy_v);
        }
        return $tco_result;
      };
    };
    return go;
  },
  foldMap: function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldl(foldableList)(function(acc) {
        var $286 = append2(acc);
        return function($287) {
          return $286(f($287));
        };
      })(mempty2);
    };
  }
};
var foldr2 = /* @__PURE__ */ foldr(foldableList);
var semigroupList = {
  append: function(xs) {
    return function(ys) {
      return foldr2(Cons.create)(ys)(xs);
    };
  }
};
var append1 = /* @__PURE__ */ append(semigroupList);
var semigroupNonEmptyList = {
  append: function(v) {
    return function(as$prime) {
      return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
    };
  }
};
var foldable1NonEmptyList = /* @__PURE__ */ foldable1NonEmpty(foldableList);
var applyList = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Nil) {
        return Nil.value;
      }
      if (v instanceof Cons) {
        return append1(map6(v.value0)(v1))(apply(applyList)(v.value1)(v1));
      }
      throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorList;
  }
};
var apply2 = /* @__PURE__ */ apply(applyList);
var applyNonEmptyList = {
  apply: function(v) {
    return function(v1) {
      return new NonEmpty(v.value0(v1.value0), append1(apply2(v.value1)(new Cons(v1.value0, Nil.value)))(apply2(new Cons(v.value0, v.value1))(v1.value1)));
    };
  },
  Functor0: function() {
    return functorNonEmptyList;
  }
};
var altList = {
  alt: append1,
  Functor0: function() {
    return functorList;
  }
};
var plusList = /* @__PURE__ */ function() {
  return {
    empty: Nil.value,
    Alt0: function() {
      return altList;
    }
  };
}();
var applicativeNonEmptyList = {
  pure: /* @__PURE__ */ function() {
    var $315 = singleton3(plusList);
    return function($316) {
      return NonEmptyList($315($316));
    };
  }(),
  Apply0: function() {
    return applyNonEmptyList;
  }
};
// output/Data.List.NonEmpty/index.js
var singleton4 = /* @__PURE__ */ function() {
  var $200 = singleton3(plusList);
  return function($201) {
    return NonEmptyList($200($201));
  };
}();
// output/Foreign/index.js
var pure3 = /* @__PURE__ */ pure(applicativeEither);
var ForeignError = /* @__PURE__ */ function() {
  function ForeignError2(value0) {
    this.value0 = value0;
  }
  ForeignError2.create = function(value0) {
    return new ForeignError2(value0);
  };
  return ForeignError2;
}();
var TypeMismatch = /* @__PURE__ */ function() {
  function TypeMismatch2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  TypeMismatch2.create = function(value0) {
    return function(value1) {
      return new TypeMismatch2(value0, value1);
    };
  };
  return TypeMismatch2;
}();
var ErrorAtIndex = /* @__PURE__ */ function() {
  function ErrorAtIndex2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ErrorAtIndex2.create = function(value0) {
    return function(value1) {
      return new ErrorAtIndex2(value0, value1);
    };
  };
  return ErrorAtIndex2;
}();
var ErrorAtProperty = /* @__PURE__ */ function() {
  function ErrorAtProperty2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ErrorAtProperty2.create = function(value0) {
    return function(value1) {
      return new ErrorAtProperty2(value0, value1);
    };
  };
  return ErrorAtProperty2;
}();
var unsafeToForeign = unsafeCoerce2;
var unsafeFromForeign = unsafeCoerce2;
var fail = function(dictMonad) {
  var $153 = throwError(monadThrowExceptT(dictMonad));
  return function($154) {
    return $153(singleton4($154));
  };
};
var unsafeReadTagged = function(dictMonad) {
  var pure1 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(tag) {
    return function(value) {
      if (tagOf(value) === tag) {
        return pure1(unsafeFromForeign(value));
      }
      if (otherwise) {
        return fail1(new TypeMismatch(tag, tagOf(value)));
      }
      throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value.constructor.name]);
    };
  };
};
var readNumber = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("Number");
};
var readInt = function(dictMonad) {
  var map7 = map(dictMonad.Bind1().Apply0().Functor0());
  var readNumber1 = readNumber(dictMonad);
  return function(value) {
    var error4 = new Left(singleton4(new TypeMismatch("Int", tagOf(value))));
    var fromNumber2 = function() {
      var $155 = maybe(error4)(pure3);
      return function($156) {
        return $155(fromNumber($156));
      };
    }();
    return mapExceptT(map7(either($$const(error4))(fromNumber2)))(readNumber1(value));
  };
};
var readString = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("String");
};

// output/Promise.Internal/foreign.js
function thenOrCatch(k, c, p) {
  return p.then(k, c);
}
function resolve(a) {
  return Promise.resolve(a);
}
// output/Promise.Rejection/foreign.js
function _toError(just, nothing, ref) {
  if (ref instanceof Error) {
    return just(ref);
  }
  return nothing;
}

// output/Promise.Rejection/index.js
var toError = /* @__PURE__ */ function() {
  return runFn3(_toError)(Just.create)(Nothing.value);
}();
// output/Promise/index.js
var thenOrCatch2 = function() {
  return function(k) {
    return function(c) {
      return function(p) {
        return function() {
          return thenOrCatch(mkEffectFn1(k), mkEffectFn1(c), p);
        };
      };
    };
  };
};
var resolve2 = function() {
  return resolve;
};

// output/Promise.Aff/index.js
var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
var mempty2 = /* @__PURE__ */ mempty(monoidCanceler);
var thenOrCatch3 = /* @__PURE__ */ thenOrCatch2();
var map7 = /* @__PURE__ */ map(functorEffect);
var resolve3 = /* @__PURE__ */ resolve2();
var alt2 = /* @__PURE__ */ alt(altMaybe);
var map1 = /* @__PURE__ */ map(functorMaybe);
var readString2 = /* @__PURE__ */ readString(monadIdentity);
var bind2 = /* @__PURE__ */ bind(bindAff);
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
var toAff$prime = function(customCoerce) {
  return function(p) {
    return makeAff(function(cb) {
      return voidRight2(mempty2)(thenOrCatch3(function(a) {
        return map7(resolve3)(cb(new Right(a)));
      })(function(e) {
        return map7(resolve3)(cb(new Left(customCoerce(e))));
      })(p));
    });
  };
};
var coerce3 = function(rej) {
  return fromMaybe$prime(function(v) {
    return error("Promise failed, couldn't extract JS Error or String");
  })(alt2(toError(rej))(map1(error)(hush(runExcept(readString2(unsafeToForeign(rej)))))));
};
var toAff = /* @__PURE__ */ toAff$prime(coerce3);
var toAffE = function(f) {
  return bind2(liftEffect2(f))(toAff);
};

// output/Yoga.JSON/foreign.js
function reviver(key, value) {
  if (key === "big") {
    return BigInt(value);
  }
  return value;
}
var _parseJSON = (payload) => JSON.parse(payload, reviver);
function replacer(key, value) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
var _unsafeStringify = (data) => JSON.stringify(data, replacer);
// output/Data.Array.NonEmpty.Internal/foreign.js
var traverse1Impl = function() {
  function Cont(fn) {
    this.fn = fn;
  }
  var emptyList = {};
  var ConsCell = function(head, tail) {
    this.head = head;
    this.tail = tail;
  };
  function finalCell(head) {
    return new ConsCell(head, emptyList);
  }
  function consList(x) {
    return function(xs) {
      return new ConsCell(x, xs);
    };
  }
  function listToArray(list) {
    var arr = [];
    var xs = list;
    while (xs !== emptyList) {
      arr.push(xs.head);
      xs = xs.tail;
    }
    return arr;
  }
  return function(apply3, map8, f) {
    var buildFrom = function(x, ys) {
      return apply3(map8(consList)(f(x)))(ys);
    };
    var go = function(acc, currentLen, xs) {
      if (currentLen === 0) {
        return acc;
      } else {
        var last2 = xs[currentLen - 1];
        return new Cont(function() {
          var built = go(buildFrom(last2, acc), currentLen - 1, xs);
          return built;
        });
      }
    };
    return function(array) {
      var acc = map8(finalCell)(f(array[array.length - 1]));
      var result = go(acc, array.length - 1, array);
      while (result instanceof Cont) {
        result = result.fn();
      }
      return map8(listToArray)(result);
    };
  };
}();
// output/Data.Variant/index.js
var onMatch = function() {
  return function() {
    return function() {
      return function(r) {
        return function(k) {
          return function(v) {
            if (unsafeHas(v.type)(r)) {
              return unsafeGet(v.type)(r)(v.value);
            }
            return k(v);
          };
        };
      };
    };
  };
};
var onMatch1 = /* @__PURE__ */ onMatch()()();
var on2 = function() {
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(p) {
      return function(f) {
        return function(g) {
          return function(r) {
            if (r.type === reflectSymbol2(p)) {
              return f(r.value);
            }
            return g(r);
          };
        };
      };
    };
  };
};
var inj = function() {
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(p) {
      return function(value) {
        return {
          type: reflectSymbol2(p),
          value
        };
      };
    };
  };
};
var case_ = function(r) {
  return unsafeCrashWith("Data.Variant: pattern match failure [" + (r.type + "]"));
};
var match = function() {
  return function() {
    return function() {
      return function(r) {
        return onMatch1(r)(case_);
      };
    };
  };
};

// output/Foreign.Index/foreign.js
function unsafeReadPropImpl(f, s, key, value) {
  return value == null ? f : s(value[key]);
}

// output/Foreign.Index/index.js
var unsafeReadProp = function(dictMonad) {
  var fail2 = fail(dictMonad);
  var pure4 = pure(applicativeExceptT(dictMonad));
  return function(k) {
    return function(value) {
      return unsafeReadPropImpl(fail2(new TypeMismatch("object", typeOf(value))), pure4, k, value);
    };
  };
};
var readProp = function(dictMonad) {
  return unsafeReadProp(dictMonad);
};
// output/Record.Builder/foreign.js
function copyRecord(rec) {
  var copy = {};
  for (var key in rec) {
    if ({}.hasOwnProperty.call(rec, key)) {
      copy[key] = rec[key];
    }
  }
  return copy;
}
function unsafeInsert(l) {
  return function(a) {
    return function(rec) {
      rec[l] = a;
      return rec;
    };
  };
}

// output/Record.Builder/index.js
var semigroupoidBuilder = semigroupoidFn;
var insert4 = function() {
  return function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(l) {
        return function(a) {
          return function(r1) {
            return unsafeInsert(reflectSymbol2(l))(a)(r1);
          };
        };
      };
    };
  };
};
var categoryBuilder = categoryFn;
var build = function(v) {
  return function(r1) {
    return v(copyRecord(r1));
  };
};

// output/Yoga.JSON/index.js
var identity7 = /* @__PURE__ */ identity(categoryBuilder);
var readString3 = /* @__PURE__ */ readString(monadIdentity);
var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
var pure4 = /* @__PURE__ */ pure(applicativeNonEmptyList);
var except2 = /* @__PURE__ */ except(applicativeIdentity);
var readInt2 = /* @__PURE__ */ readInt(monadIdentity);
var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadIdentity);
var pure1 = /* @__PURE__ */ pure(applicativeExceptT2);
var map8 = /* @__PURE__ */ map(functorArray);
var compose1 = /* @__PURE__ */ compose(semigroupoidBuilder);
var insert6 = /* @__PURE__ */ insert4()();
var append2 = /* @__PURE__ */ append(semigroupNonEmptyList);
var functorExceptT2 = /* @__PURE__ */ functorExceptT(functorIdentity);
var map12 = /* @__PURE__ */ map(functorExceptT2);
var map22 = /* @__PURE__ */ map(functorNonEmptyList);
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindExceptT2);
var lmap2 = /* @__PURE__ */ lmap(bifunctorEither);
var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindExceptT2);
var readProp2 = /* @__PURE__ */ readProp(monadIdentity);
var writeForeignString = {
  writeImpl: unsafeToForeign
};
var writeForeignInt = {
  writeImpl: unsafeToForeign
};
var writeForeignFieldsNilRowR = {
  writeImplFields: function(v) {
    return function(v1) {
      return identity7;
    };
  }
};
var readForeignString = {
  readImpl: readString3
};
var readForeignInt = {
  readImpl: readInt2
};
var readForeignFieldsNilRowRo = {
  getFields: function(v) {
    return function(v1) {
      return pure1(identity7);
    };
  }
};
var writeImplFields = function(dict) {
  return dict.writeImplFields;
};
var writeForeignRecord = function() {
  return function(dictWriteForeignFields) {
    var writeImplFields1 = writeImplFields(dictWriteForeignFields);
    return {
      writeImpl: function(rec) {
        var steps = writeImplFields1($$Proxy.value)(rec);
        return unsafeToForeign(build(steps)({}));
      }
    };
  };
};
var writeImpl = function(dict) {
  return dict.writeImpl;
};
var writeJSON = function(dictWriteForeign) {
  var $481 = writeImpl(dictWriteForeign);
  return function($482) {
    return _unsafeStringify($481($482));
  };
};
var writeForeignArray = function(dictWriteForeign) {
  var writeImpl5 = writeImpl(dictWriteForeign);
  return {
    writeImpl: function(xs) {
      return unsafeToForeign(map8(writeImpl5)(xs));
    }
  };
};
var writeForeignFieldsCons = function(dictIsSymbol) {
  var get3 = get(dictIsSymbol)();
  var insert42 = insert6(dictIsSymbol);
  return function(dictWriteForeign) {
    var writeImpl5 = writeImpl(dictWriteForeign);
    return function(dictWriteForeignFields) {
      var writeImplFields1 = writeImplFields(dictWriteForeignFields);
      return function() {
        return function() {
          return function() {
            return {
              writeImplFields: function(v) {
                return function(rec) {
                  var rest = writeImplFields1($$Proxy.value)(rec);
                  var value = writeImpl5(get3($$Proxy.value)(rec));
                  var result = compose1(insert42($$Proxy.value)(value))(rest);
                  return result;
                };
              }
            };
          };
        };
      };
    };
  };
};
var readImpl = function(dict) {
  return dict.readImpl;
};
var parseJSON = /* @__PURE__ */ function() {
  var $560 = lmap2(function($563) {
    return pure4(ForeignError.create(message($563)));
  });
  var $561 = runEffectFn1(_parseJSON);
  return function($562) {
    return ExceptT(Identity($560(unsafePerformEffect($$try($561($562))))));
  };
}();
var readJSON = function(dictReadForeign) {
  var $564 = composeKleisliFlipped2(readImpl(dictReadForeign))(parseJSON);
  return function($565) {
    return runExcept($564($565));
  };
};
var getFields = function(dict) {
  return dict.getFields;
};
var readForeignFieldsCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var insert42 = insert6(dictIsSymbol);
  return function(dictReadForeign) {
    var readImpl5 = readImpl(dictReadForeign);
    return function(dictReadForeignFields) {
      var getFields1 = getFields(dictReadForeignFields);
      return function() {
        return function() {
          return {
            getFields: function(v) {
              return function(obj) {
                var rest = getFields1($$Proxy.value)(obj);
                var name2 = reflectSymbol2($$Proxy.value);
                var enrichErrorWithPropName = withExcept(map22(ErrorAtProperty.create(name2)));
                var value = enrichErrorWithPropName(bindFlipped2(readImpl5)(readProp2(name2)(obj)));
                var first = map12(insert42($$Proxy.value))(value);
                return except2(function() {
                  var v1 = runExcept(rest);
                  var v2 = runExcept(first);
                  if (v2 instanceof Right && v1 instanceof Right) {
                    return new Right(compose1(v2.value0)(v1.value0));
                  }
                  if (v2 instanceof Left && v1 instanceof Left) {
                    return new Left(append2(v2.value0)(v1.value0));
                  }
                  if (v2 instanceof Right && v1 instanceof Left) {
                    return new Left(v1.value0);
                  }
                  if (v2 instanceof Left && v1 instanceof Right) {
                    return new Left(v2.value0);
                  }
                  throw new Error("Failed pattern match at Yoga.JSON (line 362, column 5 - line 366, column 33): " + [v2.constructor.name, v1.constructor.name]);
                }());
              };
            }
          };
        };
      };
    };
  };
};
var readForeignRecord = function() {
  return function(dictReadForeignFields) {
    var getFields1 = getFields(dictReadForeignFields);
    return {
      readImpl: function(o) {
        return map12(flip(build)({}))(getFields1($$Proxy.value)(o));
      }
    };
  };
};

// output/Yoga.Fetch.Om.MakeRequest/index.js
var fromFoldable5 = /* @__PURE__ */ fromFoldable2(foldableArray);
var append3 = /* @__PURE__ */ append(semigroupArray);
var bind3 = /* @__PURE__ */ bind(bindAff);
var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
var $$new4 = /* @__PURE__ */ $$new2()()(/* @__PURE__ */ toInternalRowRow()()(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReques3)()()()({
  reflectSymbol: function() {
    return "body";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReques1)()()()({
  reflectSymbol: function() {
    return "cache";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReques2)()()()({
  reflectSymbol: function() {
    return "credentials";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterDuplex)()()()({
  reflectSymbol: function() {
    return "duplex";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterHeader)()()()({
  reflectSymbol: function() {
    return "headers";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterIntegr)()()()({
  reflectSymbol: function() {
    return "integrity";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterMethod)()()()({
  reflectSymbol: function() {
    return "method";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReques)()()()({
  reflectSymbol: function() {
    return "mode";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReferr1)()()()({
  reflectSymbol: function() {
    return "referrer";
  }
})(/* @__PURE__ */ toInternalHelperCons(toInternalConverterReferr)()()()({
  reflectSymbol: function() {
    return "referrerPolicy";
  }
})(toInternalHelperNilRow)()())()())()())()())()())()())()())()())()())()()));
var makeRequestPOST = {
  httpMethod: function(v) {
    return POST.value;
  }
};
var bodyEncodingJSON = function(dictWriteForeign) {
  var writeJSON2 = writeJSON(dictWriteForeign);
  return {
    encodingContentType: function(v) {
      return "application/json";
    },
    encodeBody: function(b) {
      return new Just(writeJSON2(b));
    }
  };
};
var httpMethod = function(dict) {
  return dict.httpMethod;
};
var makeRequest = function(dictMakeRequest) {
  var httpMethod1 = httpMethod(dictMakeRequest);
  return function(proxy) {
    return function(url) {
      return function(customHeaders) {
        return function(bodyContentType) {
          return function(maybeBody) {
            var method = httpMethod1(proxy);
            var customArr = toArray(customHeaders);
            var hasContentType = any2(function(t) {
              return fst(t) === "content-type";
            })(customArr);
            var contentTypeArr = function() {
              if (maybeBody instanceof Nothing) {
                return [];
              }
              if (maybeBody instanceof Just && hasContentType) {
                return [];
              }
              if (maybeBody instanceof Just) {
                return [new Tuple("Content-Type", bodyContentType)];
              }
              throw new Error("Failed pattern match at Yoga.Fetch.Om.MakeRequest (line 75, column 20 - line 78, column 52): " + [maybeBody.constructor.name]);
            }();
            var body = function() {
              if (maybeBody instanceof Nothing) {
                return empty4;
              }
              if (maybeBody instanceof Just) {
                return fromString3(maybeBody.value0);
              }
              throw new Error("Failed pattern match at Yoga.Fetch.Om.MakeRequest (line 80, column 10 - line 82, column 32): " + [maybeBody.constructor.name]);
            }();
            var allHeaders = fromFoldable5(append3(contentTypeArr)(customArr));
            var options = {
              method,
              headers: allHeaders,
              body,
              credentials: SameOrigin2.value,
              mode: Cors.value,
              referrer: new ReferrerUrl(""),
              referrerPolicy: NoReferrer.value,
              integrity: "",
              duplex: Half.value,
              cache: Default2.value
            };
            return bind3(liftEffect3($$new4(url)(options)))(function(request) {
              return toAffE(fetch2(request));
            });
          };
        };
      };
    };
  };
};
var encodingContentType = function(dict) {
  return dict.encodingContentType;
};
var encodeBody = function(dict) {
  return dict.encodeBody;
};

// output/JS.Fetch.Response/foreign.js
function status(resp) {
  return resp.status;
}
function text(resp) {
  return function() {
    return resp.text();
  };
}
// output/Effect.AVar/foreign.js
var AVar = function() {
  function MutableQueue() {
    this.head = null;
    this.last = null;
    this.size = 0;
  }
  function MutableCell(queue, value) {
    this.queue = queue;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
  function AVar2(value) {
    this.draining = false;
    this.error = null;
    this.value = value;
    this.takes = new MutableQueue;
    this.reads = new MutableQueue;
    this.puts = new MutableQueue;
  }
  var EMPTY = {};
  function runEff(eff) {
    try {
      eff();
    } catch (error4) {
      setTimeout(function() {
        throw error4;
      }, 0);
    }
  }
  function putLast(queue, value) {
    var cell = new MutableCell(queue, value);
    switch (queue.size) {
      case 0:
        queue.head = cell;
        break;
      case 1:
        cell.prev = queue.head;
        queue.head.next = cell;
        queue.last = cell;
        break;
      default:
        cell.prev = queue.last;
        queue.last.next = cell;
        queue.last = cell;
    }
    queue.size++;
    return cell;
  }
  function takeLast(queue) {
    var cell;
    switch (queue.size) {
      case 0:
        return null;
      case 1:
        cell = queue.head;
        queue.head = null;
        break;
      case 2:
        cell = queue.last;
        queue.head.next = null;
        queue.last = null;
        break;
      default:
        cell = queue.last;
        queue.last = cell.prev;
        queue.last.next = null;
    }
    cell.prev = null;
    cell.queue = null;
    queue.size--;
    return cell.value;
  }
  function takeHead(queue) {
    var cell;
    switch (queue.size) {
      case 0:
        return null;
      case 1:
        cell = queue.head;
        queue.head = null;
        break;
      case 2:
        cell = queue.head;
        queue.last.prev = null;
        queue.head = queue.last;
        queue.last = null;
        break;
      default:
        cell = queue.head;
        queue.head = cell.next;
        queue.head.prev = null;
    }
    cell.next = null;
    cell.queue = null;
    queue.size--;
    return cell.value;
  }
  function deleteCell(cell) {
    if (cell.queue === null) {
      return;
    }
    if (cell.queue.last === cell) {
      takeLast(cell.queue);
      return;
    }
    if (cell.queue.head === cell) {
      takeHead(cell.queue);
      return;
    }
    if (cell.prev) {
      cell.prev.next = cell.next;
    }
    if (cell.next) {
      cell.next.prev = cell.prev;
    }
    cell.queue.size--;
    cell.queue = null;
    cell.value = null;
    cell.next = null;
    cell.prev = null;
  }
  function drainVar(util, avar) {
    if (avar.draining) {
      return;
    }
    var ps = avar.puts;
    var ts = avar.takes;
    var rs = avar.reads;
    var p, r, t, value, rsize;
    avar.draining = true;
    while (true) {
      p = null;
      r = null;
      t = null;
      value = avar.value;
      rsize = rs.size;
      if (avar.error !== null) {
        value = util.left(avar.error);
        while (p = takeHead(ps)) {
          runEff(p.cb(value));
        }
        while (r = takeHead(rs)) {
          runEff(r(value));
        }
        while (t = takeHead(ts)) {
          runEff(t(value));
        }
        break;
      }
      if (value === EMPTY && (p = takeHead(ps))) {
        avar.value = value = p.value;
      }
      if (value !== EMPTY) {
        t = takeHead(ts);
        while (rsize-- && (r = takeHead(rs))) {
          runEff(r(util.right(value)));
        }
        if (t !== null) {
          avar.value = EMPTY;
          runEff(t(util.right(value)));
        }
      }
      if (p !== null) {
        runEff(p.cb(util.right(undefined)));
      }
      if (avar.value === EMPTY && ps.size === 0 || avar.value !== EMPTY && ts.size === 0) {
        break;
      }
    }
    avar.draining = false;
  }
  AVar2.EMPTY = EMPTY;
  AVar2.putLast = putLast;
  AVar2.takeLast = takeLast;
  AVar2.takeHead = takeHead;
  AVar2.deleteCell = deleteCell;
  AVar2.drainVar = drainVar;
  return AVar2;
}();
// output/Effect.Aff.Class/index.js
var liftAff = function(dict) {
  return dict.liftAff;
};

// output/Uncurried.RWSET/index.js
var More = /* @__PURE__ */ function() {
  function More2(value0) {
    this.value0 = value0;
  }
  More2.create = function(value0) {
    return new More2(value0);
  };
  return More2;
}();
var Lift = /* @__PURE__ */ function() {
  function Lift2(value0) {
    this.value0 = value0;
  }
  Lift2.create = function(value0) {
    return new Lift2(value0);
  };
  return Lift2;
}();
var Stop = /* @__PURE__ */ function() {
  function Stop2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  Stop2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Stop2(value0, value1, value2);
      };
    };
  };
  return Stop2;
}();
var monadTransRWSET = function(dictMonoid) {
  var mempty3 = mempty(dictMonoid);
  return {
    lift: function(dictMonad) {
      var map13 = map(dictMonad.Bind1().Apply0().Functor0());
      return function(m) {
        return function(v, state2, v1, lift$prime, v2, done) {
          return lift$prime(map13(function(a) {
            return function(v3) {
              return done(state2, a, mempty3);
            };
          })(m));
        };
      };
    }
  };
};
var functorRWSET = {
  map: function(f) {
    return function(v) {
      return function(environment, state0, more, lift$prime, error4, done) {
        return more(function(v1) {
          return v(environment, state0, more, lift$prime, error4, function(state1, a, w) {
            return more(function(v2) {
              return done(state1, f(a), w);
            });
          });
        });
      };
    };
  }
};
var applyRWSET = function(dictMonoid) {
  var append4 = append(dictMonoid.Semigroup0());
  return {
    apply: function(v) {
      return function(v1) {
        return function(environment, state0, more, lift$prime, error4, done) {
          return more(function(v2) {
            return v(environment, state0, more, lift$prime, error4, function(state1, f, w0) {
              return more(function(v3) {
                return v1(environment, state1, more, lift$prime, error4, function(state2, a, w1) {
                  return more(function(v4) {
                    return done(state2, f(a), append4(w0)(w1));
                  });
                });
              });
            });
          });
        };
      };
    },
    Functor0: function() {
      return functorRWSET;
    }
  };
};
var bindRWSET = function(dictMonoid) {
  var append4 = append(dictMonoid.Semigroup0());
  var applyRWSET1 = applyRWSET(dictMonoid);
  return {
    bind: function(v) {
      return function(f) {
        return function(environment, state0, more, lift$prime, error4, done) {
          return more(function(v1) {
            return v(environment, state0, more, lift$prime, error4, function(state1, x, w0) {
              return more(function(v2) {
                var v3 = f(x);
                return v3(environment, state1, more, lift$prime, error4, function(state2, y, w1) {
                  return more(function(v4) {
                    return done(state2, y, append4(w0)(w1));
                  });
                });
              });
            });
          });
        };
      };
    },
    Apply0: function() {
      return applyRWSET1;
    }
  };
};
var applicativeRWSET = function(dictMonoid) {
  var mempty3 = mempty(dictMonoid);
  var applyRWSET1 = applyRWSET(dictMonoid);
  return {
    pure: function(a) {
      return function(v, state2, v1, v2, v3, done) {
        return done(state2, a, mempty3);
      };
    },
    Apply0: function() {
      return applyRWSET1;
    }
  };
};
var monadRWSET = function(dictMonoid) {
  var applicativeRWSET1 = applicativeRWSET(dictMonoid);
  var bindRWSET1 = bindRWSET(dictMonoid);
  return {
    Applicative0: function() {
      return applicativeRWSET1;
    },
    Bind1: function() {
      return bindRWSET1;
    }
  };
};
var monadAskRWSET = function(dictMonoid) {
  var mempty3 = mempty(dictMonoid);
  var monadRWSET1 = monadRWSET(dictMonoid);
  return {
    ask: function(environment, state2, v, v1, v2, done) {
      return done(state2, environment, mempty3);
    },
    Monad0: function() {
      return monadRWSET1;
    }
  };
};
var monadThrowRWSET = function(dictMonoid) {
  var mempty3 = mempty(dictMonoid);
  var monadRWSET1 = monadRWSET(dictMonoid);
  return {
    throwError: function(e) {
      return function(v, state2, v1, v2, error4, v3) {
        return error4(state2, e, mempty3);
      };
    },
    Monad0: function() {
      return monadRWSET1;
    }
  };
};
var runRWSET = function(dictMonadRec) {
  var Monad0 = dictMonadRec.Monad0();
  var map13 = map(Monad0.Bind1().Apply0().Functor0());
  var pure5 = pure(Monad0.Applicative0());
  var tailRecM3 = tailRecM(dictMonadRec);
  return function(r) {
    return function(s) {
      return function(v) {
        var go = function($copy_step) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(step) {
            var v1 = step(unit);
            if (v1 instanceof More) {
              $copy_step = v1.value0;
              return;
            }
            if (v1 instanceof Lift) {
              $tco_done = true;
              return map13(Loop.create)(v1.value0);
            }
            if (v1 instanceof Stop) {
              $tco_done = true;
              return pure5(new Done(new Tuple(v1.value0, new Tuple(v1.value1, v1.value2))));
            }
            throw new Error("Failed pattern match at Uncurried.RWSET (line 252, column 15 - line 258, column 35): " + [v1.constructor.name]);
          }
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_step);
          }
          return $tco_result;
        };
        return tailRecM3(go)(function(v1) {
          return v(r, s, More.create, Lift.create, function(s$prime, e, w) {
            return new Stop(s$prime, new Left(e), w);
          }, function(s$prime, a, w) {
            return new Stop(s$prime, new Right(a), w);
          });
        });
      };
    };
  };
};

// output/Yoga.Om.Error/index.js
var inj3 = /* @__PURE__ */ inj();
var singletonVariantRecord = function() {
  return function() {
    return function() {
      return function(dictIsSymbol) {
        return {
          singletonRecordToVariant: function() {
            var $15 = inj3(dictIsSymbol)($$Proxy.value);
            var $16 = get(dictIsSymbol)()($$Proxy.value);
            return function($17) {
              return $15($16($17));
            };
          }()
        };
      };
    };
  };
};
var singletonRecordToVariant = function(dict) {
  return dict.singletonRecordToVariant;
};
// output/Yoga.Om/index.js
var match2 = /* @__PURE__ */ match()()();
var bind4 = /* @__PURE__ */ bind(bindAff);
var runRWSET2 = /* @__PURE__ */ runRWSET(monadRecAff);
var pure5 = /* @__PURE__ */ pure(applicativeAff);
var map9 = /* @__PURE__ */ map(functorAff);
var $$try3 = /* @__PURE__ */ $$try2(monadErrorAff);
var void1 = /* @__PURE__ */ $$void(functorEffect);
var exceptionIsSymbol = {
  reflectSymbol: function() {
    return "exception";
  }
};
var singletonVariantRecord2 = /* @__PURE__ */ singletonVariantRecord()()()(exceptionIsSymbol);
var lift3 = /* @__PURE__ */ lift(/* @__PURE__ */ monadTransRWSET(monoidUnit))(monadAff);
var onMatch2 = /* @__PURE__ */ onMatch()()();
var monadThrowVariantExceptio = /* @__PURE__ */ monadThrowRWSET(monoidUnit);
var throwError1 = /* @__PURE__ */ throwError(monadThrowVariantExceptio);
var monadOm = /* @__PURE__ */ monadRWSET(monoidUnit);
var monadAskOm = /* @__PURE__ */ monadAskRWSET(monoidUnit);
var ask2 = /* @__PURE__ */ ask(monadAskOm);
var bindOm = /* @__PURE__ */ bindRWSET(monoidUnit);
var bind12 = /* @__PURE__ */ bind(bindOm);
var applicativeOm = /* @__PURE__ */ applicativeRWSET(monoidUnit);
var pure23 = /* @__PURE__ */ pure(applicativeOm);
var toOm = function(dict) {
  return dict.toOm;
};
var runOm = function() {
  return function() {
    return function() {
      return function(ctx) {
        return function(errorHandlers) {
          return function(v) {
            return bind4(runRWSET2(ctx)(unit)(v))(function(v1) {
              if (v1.value1.value0 instanceof Right) {
                return pure5(v1.value1.value0.value0);
              }
              if (v1.value1.value0 instanceof Left) {
                return match2(errorHandlers)(v1.value1.value0.value0);
              }
              throw new Error("Failed pattern match at Yoga.Om (line 399, column 29 - line 401, column 53): " + [v1.constructor.name]);
            });
          };
        };
      };
    };
  };
};
var runOm1 = /* @__PURE__ */ runOm()()();
var launchOm = function() {
  return function() {
    return function() {
      return function(ctx) {
        return function(handlers) {
          return function(om) {
            return launchAff(runOm1(ctx)(handlers)(om));
          };
        };
      };
    };
  };
};
var launchOm1 = /* @__PURE__ */ launchOm()()();
var launchOm_ = function() {
  return function() {
    return function() {
      return function(ctx) {
        return function(handlers) {
          return function(om) {
            return void1(launchOm1(ctx)(handlers)(om));
          };
        };
      };
    };
  };
};
var error4 = function(dictSingletonVariantRecord) {
  return singletonRecordToVariant(dictSingletonVariantRecord);
};
var $$throw = function(dictSingletonVariantRecord) {
  var error22 = error4(dictSingletonVariantRecord);
  return function(dictMonadThrow) {
    var $307 = throwError(dictMonadThrow);
    return function($308) {
      return $307(error22($308));
    };
  };
};
var throw1 = /* @__PURE__ */ $$throw(singletonVariantRecord2)(monadThrowVariantExceptio);
var fromAff = function(e) {
  return bind12(lift3($$try3(e)))(either(function($309) {
    return throw1(function(v) {
      return {
        exception: v
      };
    }($309));
  })(pure23));
};
var monadEffectOm = {
  liftEffect: /* @__PURE__ */ function() {
    var $314 = liftEffect(monadEffectAff);
    return function($315) {
      return fromAff($314($315));
    };
  }(),
  Monad0: function() {
    return monadOm;
  }
};
var monadAffOm = {
  liftAff: fromAff,
  MonadEffect0: function() {
    return monadEffectOm;
  }
};
var liftAff2 = /* @__PURE__ */ liftAff(monadAffOm);
var handleErrors = function() {
  return function() {
    return function() {
      return function(cases) {
        return function(v) {
          return bind12(ask2)(function(ctx) {
            return bind12(liftAff2(map9(function(v1) {
              return v1.value1.value0;
            })(runRWSET2(ctx)(unit)(v))))(function(err) {
              return either(onMatch2(cases)(throwError1))(pure23)(err);
            });
          });
        };
      };
    };
  };
};
var toOmAff = {
  toOm: liftAff2
};

// output/Yoga.HTTP.API.Route.StatusCode/index.js
var statusCodeMapImplProxy$34ok = {
  statusCodeForImpl: function(v) {
    return 200;
  }
};
var statusCodeMapImplProxy$34ba1 = {
  statusCodeForImpl: function(v) {
    return 400;
  }
};
var statusCodeForImpl = function(dict) {
  return dict.statusCodeForImpl;
};
var statusCodeMap = function(dictStatusCodeMapImpl) {
  var statusCodeForImpl1 = statusCodeForImpl(dictStatusCodeMapImpl);
  return {
    statusCodeFor: function(proxy) {
      return statusCodeForImpl1(proxy);
    }
  };
};
var statusCodeFor = function(dict) {
  return dict.statusCodeFor;
};

// output/Yoga.JSON.Error/index.js
var show2 = /* @__PURE__ */ show(showInt);
var toJSONPath = function(fe) {
  var go = function(v) {
    if (v instanceof ForeignError) {
      return "";
    }
    if (v instanceof TypeMismatch) {
      return "";
    }
    if (v instanceof ErrorAtIndex) {
      return "[" + (show2(v.value0) + ("]" + go(v.value1)));
    }
    if (v instanceof ErrorAtProperty && (v.value1 instanceof TypeMismatch && v.value1.value1 === "undefined")) {
      return "";
    }
    if (v instanceof ErrorAtProperty) {
      return "." + (v.value0 + go(v.value1));
    }
    throw new Error("Failed pattern match at Yoga.JSON.Error (line 15, column 8 - line 20, column 49): " + [v.constructor.name]);
  };
  var path = go(fe);
  return "$" + path;
};
var errorToJSON = function(err) {
  var path = toJSONPath(err);
  var go = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      if (v instanceof ForeignError) {
        $tco_done = true;
        return {
          path,
          message: v.value0
        };
      }
      if (v instanceof TypeMismatch && v.value1 === "Undefined") {
        $tco_done = true;
        return {
          path,
          message: "Must provide a value of type '" + (v.value0 + "'")
        };
      }
      if (v instanceof TypeMismatch && v.value1 === "undefined") {
        $tco_done = true;
        return {
          path,
          message: "Must provide a value of type '" + (v.value0 + "'")
        };
      }
      if (v instanceof TypeMismatch) {
        $tco_done = true;
        return {
          path,
          message: "Must provide a value of type '" + (v.value0 + ("' instead of '" + (v.value1 + "'")))
        };
      }
      if (v instanceof ErrorAtIndex) {
        $copy_v = v.value1;
        return;
      }
      if (v instanceof ErrorAtProperty) {
        $copy_v = v.value1;
        return;
      }
      throw new Error("Failed pattern match at Yoga.JSON.Error (line 38, column 8 - line 56, column 31): " + [v.constructor.name]);
    }
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    return $tco_result;
  };
  return go(err);
};
var renderHumanError = /* @__PURE__ */ function() {
  var toHuman = function(v) {
    return v.message + (" at " + v.path);
  };
  return function($36) {
    return toHuman(errorToJSON($36));
  };
}();
var withStringErrors = /* @__PURE__ */ lmap(bifunctorEither)(/* @__PURE__ */ intercalateMap(foldable1NonEmptyList)(semigroupString)(`
`)(renderHumanError));
// output/Yoga.Fetch.Om.ParseResponse/index.js
var throwError2 = /* @__PURE__ */ throwError(monadThrowAff);
var show3 = /* @__PURE__ */ show(showInt);
var throwError12 = /* @__PURE__ */ throwError(monadThrowVariantExceptio);
var inj4 = /* @__PURE__ */ inj();
var inj1 = /* @__PURE__ */ inj4({
  reflectSymbol: function() {
    return "exception";
  }
});
var bind5 = /* @__PURE__ */ bind(bindAff);
var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
var pure6 = /* @__PURE__ */ pure(applicativeAff);
var toOm2 = /* @__PURE__ */ toOm(toOmAff);
var bind13 = /* @__PURE__ */ bind(bindOm);
var parseSuccessRLNil = {
  parseSuccessRL: function(v) {
    return function(status3) {
      return function(v1) {
        return throwError2(error("Unexpected success status code: " + show3(status3)));
      };
    };
  }
};
var parseResponseBody1 = function(dictReadForeign) {
  return {
    parseResponseBody: function() {
      var $126 = readJSON(dictReadForeign);
      return function($127) {
        return withStringErrors($126($127));
      };
    }()
  };
};
var parseErrorRLNil = {
  parseErrorRL: function(v) {
    return function(v1) {
      return function(status3) {
        return function(v2) {
          return throwError12(inj1($$Proxy.value)(error("Unexpected error status code: " + show3(status3))));
        };
      };
    };
  }
};
var parseSuccessRL = function(dict) {
  return dict.parseSuccessRL;
};
var parseResponseBody = function(dict) {
  return dict.parseResponseBody;
};
var parseSuccessRLCons = function(dictIsSymbol) {
  var inj22 = inj4(dictIsSymbol);
  return function(dictStatusCodeMap) {
    var statusCodeFor2 = statusCodeFor(dictStatusCodeMap);
    return function(dictParseResponseBody) {
      var parseResponseBody2 = parseResponseBody(dictParseResponseBody);
      return function() {
        return function() {
          return function(dictParseSuccessRL) {
            var parseSuccessRL1 = parseSuccessRL(dictParseSuccessRL);
            return {
              parseSuccessRL: function(v) {
                return function(actualStatus) {
                  return function(fetchResp) {
                    var v1 = statusCodeFor2($$Proxy.value);
                    var $110 = actualStatus === v1;
                    if ($110) {
                      return bind5(bind5(liftEffect4(text(fetchResp)))(toAff))(function(jsonText) {
                        var v2 = parseResponseBody2(jsonText);
                        if (v2 instanceof Left) {
                          return throwError2(error("Failed to parse response (status " + (show3(actualStatus) + (`):
` + v2.value0))));
                        }
                        if (v2 instanceof Right) {
                          return pure6(inj22($$Proxy.value)(v2.value0));
                        }
                        throw new Error("Failed pattern match at Yoga.Fetch.Om.ParseResponse (line 122, column 7 - line 124, column 69): " + [v2.constructor.name]);
                      });
                    }
                    return parseSuccessRL1($$Proxy.value)(actualStatus)(fetchResp);
                  };
                };
              }
            };
          };
        };
      };
    };
  };
};
var parseResponse = function(dict) {
  return dict.parseResponse;
};
var parseErrorRL = function(dict) {
  return dict.parseErrorRL;
};
var parseErrorRLCons = function(dictIsSymbol) {
  var inj22 = inj4(dictIsSymbol);
  return function(dictStatusCodeMap) {
    var statusCodeFor2 = statusCodeFor(dictStatusCodeMap);
    return function(dictParseResponseBody) {
      var parseResponseBody2 = parseResponseBody(dictParseResponseBody);
      return function() {
        return function() {
          return function() {
            return function(dictParseErrorRL) {
              var parseErrorRL1 = parseErrorRL(dictParseErrorRL);
              return {
                parseErrorRL: function(v) {
                  return function(errorProxy) {
                    return function(actualStatus) {
                      return function(jsonText) {
                        var v1 = statusCodeFor2($$Proxy.value);
                        var $117 = actualStatus === v1;
                        if ($117) {
                          var v2 = parseResponseBody2(jsonText);
                          if (v2 instanceof Left) {
                            return throwError12(inj1($$Proxy.value)(error("Failed to parse error response (status " + (show3(actualStatus) + (`):
` + v2.value0)))));
                          }
                          if (v2 instanceof Right) {
                            return throwError12(inj22($$Proxy.value)(v2.value0));
                          }
                          throw new Error("Failed pattern match at Yoga.Fetch.Om.ParseResponse (line 183, column 38 - line 185, column 73): " + [v2.constructor.name]);
                        }
                        return parseErrorRL1($$Proxy.value)(errorProxy)(actualStatus)(jsonText);
                      };
                    };
                  };
                }
              };
            };
          };
        };
      };
    };
  };
};
var parseResponse1 = function() {
  return function() {
    return function(dictParseSuccessRL) {
      var parseSuccessRL1 = parseSuccessRL(dictParseSuccessRL);
      return function(dictParseErrorRL) {
        var parseErrorRL1 = parseErrorRL(dictParseErrorRL);
        return {
          parseResponse: function(fetchResp) {
            var status3 = status(fetchResp);
            var $125 = status3 >= 200 && status3 < 300;
            if ($125) {
              return toOm2(parseSuccessRL1($$Proxy.value)(status3)(fetchResp));
            }
            return bind13(toOm2(toAffE(text(fetchResp))))(function(errorText) {
              return parseErrorRL1($$Proxy.value)($$Proxy.value)(status3)(errorText);
            });
          }
        };
      };
    };
  };
};

// output/Yoga.Fetch.Om.Variant/index.js
var on4 = /* @__PURE__ */ on2();
var identity8 = /* @__PURE__ */ identity(categoryFn);
var variantOrValueConsNil = function(dictIsSymbol) {
  var on1 = on4(dictIsSymbol);
  return function() {
    return {
      variantOrValue: function(v) {
        return function(variant) {
          return on1($$Proxy.value)(identity8)(case_)(variant);
        };
      }
    };
  };
};
var variantOrValue = function(dict) {
  return dict.variantOrValue;
};

// output/Data.String.CodePoints/foreign.js
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
// output/Yoga.Fetch.Om/index.js
var bind6 = /* @__PURE__ */ bind(bindOm);
var toOm3 = /* @__PURE__ */ toOm(toOmAff);
var pure7 = /* @__PURE__ */ pure(applicativeOm);
var toHeadersNil = {
  toHeaders: function(v) {
    return function(v1) {
      return empty3;
    };
  }
};
var deriveClientRLNil = {
  deriveClientRL: function(v) {
    return function(v1) {
      return function(acc) {
        return acc;
      };
    };
  }
};
var toHeaders = function(dict) {
  return dict.toHeaders;
};
var deriveClientFn1 = function() {
  return function() {
    return function() {
      return function() {
        return function() {
          return function(dictPathPattern) {
            return function(dictBuildUrl) {
              var buildUrl2 = buildUrl(dictBuildUrl);
              return function(dictMakeRequest) {
                var makeRequest2 = makeRequest(dictMakeRequest);
                return function(dictBodyEncoding) {
                  var encodingContentType2 = encodingContentType(dictBodyEncoding);
                  var encodeBody2 = encodeBody(dictBodyEncoding);
                  return function() {
                    return function(dictParseResponse) {
                      var parseResponse2 = parseResponse(dictParseResponse);
                      return function() {
                        return function(dictVariantOrValue) {
                          var variantOrValue2 = variantOrValue(dictVariantOrValue);
                          return function() {
                            return function() {
                              return function() {
                                return function() {
                                  return function(dictToHeaders) {
                                    var toHeaders2 = toHeaders(dictToHeaders);
                                    return function() {
                                      return function(dictBuildClientFn) {
                                        var buildClientFn2 = buildClientFn(dictBuildClientFn);
                                        return {
                                          deriveClientFn: function(baseUrl) {
                                            return function(v) {
                                              var impl = function(pathQueryRec) {
                                                return function(headersRec) {
                                                  return function(bodyVal) {
                                                    var url2 = buildUrl2(baseUrl)($$Proxy.value)(pathQueryRec)(pathQueryRec);
                                                    var hdrs = toHeaders2($$Proxy.value)(headersRec);
                                                    var ct = encodingContentType2($$Proxy.value);
                                                    return bind6(toOm3(makeRequest2($$Proxy.value)(url2)(hdrs)(ct)(encodeBody2(bodyVal))))(function(fetchResp) {
                                                      return bind6(parseResponse2(fetchResp))(function(variant) {
                                                        return pure7(variantOrValue2($$Proxy.value)(variant));
                                                      });
                                                    });
                                                  };
                                                };
                                              };
                                              return buildClientFn2($$Proxy.value)($$Proxy.value)($$Proxy.value)(impl);
                                            };
                                          }
                                        };
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};
var polymorphic = unsafeCoerce2;
var deriveClientRL = function(dict) {
  return dict.deriveClientRL;
};
var deriveClient1 = function() {
  return function(dictDeriveClientRL) {
    var deriveClientRL1 = deriveClientRL(dictDeriveClientRL);
    return {
      deriveClientImpl: function(baseUrl) {
        return function(v) {
          return deriveClientRL1(baseUrl)($$Proxy.value)({});
        };
      }
    };
  };
};
var deriveClientImpl = function(dict) {
  return dict.deriveClientImpl;
};
var deriveClientFn = function(dict) {
  return dict.deriveClientFn;
};
var deriveClientRLConsRoute = function(dictIsSymbol) {
  var insert7 = insert(dictIsSymbol)()();
  return function(dictDeriveClientFn) {
    var deriveClientFn2 = deriveClientFn(dictDeriveClientFn);
    return function(dictDeriveClientRL) {
      var deriveClientRL1 = deriveClientRL(dictDeriveClientRL);
      return function() {
        return function() {
          return function() {
            return {
              deriveClientRL: function(baseUrl) {
                return function(v) {
                  return function(acc) {
                    var rest = deriveClientRL1(baseUrl)($$Proxy.value)(acc);
                    var clientFn = deriveClientFn2(baseUrl)($$Proxy.value);
                    return insert7($$Proxy.value)(clientFn)(rest);
                  };
                };
              }
            };
          };
        };
      };
    };
  };
};
var client = function() {
  return function(dictDeriveClient) {
    var deriveClientImpl1 = deriveClientImpl(dictDeriveClient);
    return function(baseUrl) {
      return polymorphic(deriveClientImpl1(baseUrl)($$Proxy.value));
    };
  };
};

// output/Main/index.js
var unwrap3 = /* @__PURE__ */ unwrap();
var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectOm);
var map10 = /* @__PURE__ */ map(functorEffect);
var idIsSymbol = {
  reflectSymbol: function() {
    return "id";
  }
};
var tokenIsSymbol = {
  reflectSymbol: function() {
    return "token";
  }
};
var pathPatternQueryParams2 = /* @__PURE__ */ pathPatternQueryParams(/* @__PURE__ */ pathPatternBare(/* @__PURE__ */ pathPatternSegsSymbolCons({
  reflectSymbol: function() {
    return "api";
  }
})(/* @__PURE__ */ pathPatternSegsSymbolCons({
  reflectSymbol: function() {
    return "webhooks";
  }
})(/* @__PURE__ */ pathPatternSegsParamCons(idIsSymbol)(/* @__PURE__ */ pathPatternSegsParam(tokenIsSymbol))))));
var writeForeignRecord2 = /* @__PURE__ */ writeForeignRecord();
var okIsSymbol = {
  reflectSymbol: function() {
    return "ok";
  }
};
var readForeignRecord2 = /* @__PURE__ */ readForeignRecord();
var error5 = /* @__PURE__ */ error3(monadEffectEffect);
var bind7 = /* @__PURE__ */ bind(bindOm);
var pure8 = /* @__PURE__ */ pure(applicativeOm);
var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectAff);
var show4 = /* @__PURE__ */ show(showInt);
var error1 = /* @__PURE__ */ error3(monadEffectOm);
var handleErrors2 = /* @__PURE__ */ handleErrors()()();
var discard2 = /* @__PURE__ */ discard(discardUnit)(bindOm);
var serializeParamWebhookToke = {
  serializeParam: unwrap3
};
var serializeParamWebhookId = {
  serializeParam: unwrap3
};
var serializeParamWaitForResp = {
  serializeParam: /* @__PURE__ */ function() {
    var $203 = serializeParam(serializeParamBoolean);
    return function($204) {
      return $203(unwrap3($204));
    };
  }()
};
var parseWebhook = function(url2) {
  var v = stripPrefix("https://discord.com/api/webhooks/")(url2);
  if (v instanceof Nothing) {
    return Nothing.value;
  }
  if (v instanceof Just) {
    var v1 = uncons(split("/")(v.value0));
    if (v1 instanceof Just) {
      var v2 = uncons(v1.value0.tail);
      if (v2 instanceof Just) {
        return new Just({
          id: v1.value0.head,
          token: v2.value0.head
        });
      }
      return Nothing.value;
    }
    return Nothing.value;
  }
  throw new Error("Failed pattern match at Main (line 133, column 20 - line 139, column 17): " + [v.constructor.name]);
};
var env = function(key) {
  return liftEffect5(map10(fromMaybe(""))(lookupEnv(key)));
};
var discord = /* @__PURE__ */ client()(/* @__PURE__ */ deriveClient1()(/* @__PURE__ */ deriveClientRLConsRoute({
  reflectSymbol: function() {
    return "postWebhook";
  }
})(/* @__PURE__ */ deriveClientFn1()()()()()(pathPatternQueryParams2)(/* @__PURE__ */ buildUrl1(pathPatternQueryParams2)(/* @__PURE__ */ substitutePathParams1()(/* @__PURE__ */ substitutePathParamsRLCon(idIsSymbol)(serializeParamWebhookId)(/* @__PURE__ */ substitutePathParamsRLCon(tokenIsSymbol)(serializeParamWebhookToke)(substitutePathParamsRLNil)())()))(/* @__PURE__ */ appendQueryParams1()(/* @__PURE__ */ appendQueryParamsRLConsMa({
  reflectSymbol: function() {
    return "wait";
  }
})(serializeParamWaitForResp)(appendQueryParamsRLNil)())))(makeRequestPOST)(/* @__PURE__ */ bodyEncodingJSON(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "embeds";
  }
})(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "color";
  }
})(writeForeignInt)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "description";
  }
})(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "title";
  }
})(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "url";
  }
})(writeForeignString)(writeForeignFieldsNilRowR)()()())()()())()()())()()())))(writeForeignFieldsNilRowR)()()())))()(/* @__PURE__ */ parseResponse1()()(/* @__PURE__ */ parseSuccessRLCons(okIsSymbol)(/* @__PURE__ */ statusCodeMap(statusCodeMapImplProxy$34ok))(/* @__PURE__ */ parseResponseBody1(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "channel_id";
  }
})(readForeignString)(/* @__PURE__ */ readForeignFieldsCons(idIsSymbol)(readForeignString)(readForeignFieldsNilRowRo)()())()())))()()(parseSuccessRLNil))(/* @__PURE__ */ parseErrorRLCons({
  reflectSymbol: function() {
    return "badRequest";
  }
})(/* @__PURE__ */ statusCodeMap(statusCodeMapImplProxy$34ba1))(/* @__PURE__ */ parseResponseBody1(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "code";
  }
})(readForeignInt)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "message";
  }
})(readForeignString)(readForeignFieldsNilRowRo)()())()())))()()()(parseErrorRLNil)))()(/* @__PURE__ */ variantOrValueConsNil(okIsSymbol)())()()()()(toHeadersNil)()(buildClientFnConsNilIsNot))(deriveClientRLNil)()()()))("https://discord.com");
var buildPayload = function(f) {
  var ok2 = f.status === "success";
  var emoji = function() {
    if (ok2) {
      return "✅";
    }
    return "❌";
  }();
  return {
    embeds: [{
      title: emoji + (" " + (f.repo + (" " + f.ref))),
      description: function() {
        var $196 = f.desc === "";
        if ($196) {
          return "status: " + f.status;
        }
        return f.desc;
      }(),
      url: f.runUrl,
      color: function() {
        if (ok2) {
          return 3066993;
        }
        return 15158332;
      }()
    }]
  };
};
var main = /* @__PURE__ */ function() {
  var warn2 = function(msg) {
    return liftEffect5(error5(msg));
  };
  var readFields = bind7(env("STATUS"))(function(status3) {
    return bind7(env("REPO"))(function(repo) {
      return bind7(env("REF"))(function(ref) {
        return bind7(env("RUN_URL"))(function(runUrl) {
          return bind7(env("DESCRIPTION"))(function(desc) {
            return pure8({
              status: status3,
              repo,
              ref,
              runUrl,
              desc
            });
          });
        });
      });
    });
  });
  var handlers = {
    exception: function(e) {
      return liftEffect1(error5("Discord notify failed: " + message(e)));
    },
    fetchError: function(e) {
      return liftEffect1(error5("Discord notify failed (HTTP " + (show4(e.status) + ("): " + e.body))));
    }
  };
  return launchOm_()()()({})(handlers)(bind7(env("WEBHOOK"))(function(webhook) {
    var $198 = webhook === "";
    if ($198) {
      return error1("DISCORD_WEBHOOK secret is empty; skipping notification.");
    }
    var v = parseWebhook(webhook);
    if (v instanceof Nothing) {
      return warn2("Could not parse webhook URL: " + webhook);
    }
    if (v instanceof Just) {
      return bind7(readFields)(function(fields) {
        return bind7(handleErrors2({
          badRequest: function(err) {
            return discard2(warn2("Discord rejected payload: " + err.message))(function() {
              return pure8({
                id: "",
                channel_id: ""
              });
            });
          }
        })(discord.postWebhook({
          id: v.value0.id,
          token: v.value0.token,
          wait: new Just(true)
        })(buildPayload(fields))))(function() {
          return pure8(unit);
        });
      });
    }
    throw new Error("Failed pattern match at Main (line 25, column 8 - line 35, column 16): " + [v.constructor.name]);
  }));
}();

// entry.js
main();
