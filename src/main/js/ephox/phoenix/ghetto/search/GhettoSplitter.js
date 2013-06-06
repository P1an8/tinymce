define(
  'ephox.phoenix.ghetto.search.GhettoSplitter',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.phoenix.data.Spot',
    'ephox.phoenix.util.arr.PositionArray',
    'ephox.phoenix.util.str.Split'
  ],

  function (Arr, Option, Spot, PositionArray, Split) {
    var split = function (universe, offset, unit) {
      if (offset > unit.start() && offset < unit.finish()) {
        var newA = Spot.range(unit.element(), unit.start(), offset);
        var text = universe.property().getText(unit.element());
        universe.property().setText(unit.element(), text.substring(0, offset - unit.start()));
        var firstSplit = universe.create().text(text.substring(offset - unit.start()));
        universe.insert().after(unit.element(), firstSplit);
        return [ newA, Spot.range(firstSplit, offset, unit.finish()) ];
      } else {
        return [ unit ];
      }
    };

    var subdivide = function (universe, item, positions) {
      var text = universe.property().getText(item);
      var pieces = Arr.filter(Split.split(text, positions), function (section) {
        return section.length > 0;
      });

      console.log('pieces:', pieces);
      if (pieces.length <= 1) return [ Spot.range(item, 0, text.length) ];
      universe.property().setText(item, pieces[0]);
      var others = PositionArray.make(pieces.slice(1), function (a, start) {
        var nu = universe.create().text(a);
        var result = Spot.range(nu, start, start + a.length);
        return Option.some(result);
      }, pieces[0].length);
      var otherItems = Arr.map(others, function (a) {
        return a.element();
      });
      universe.insert().afterAll(item, otherItems);
      return [ Spot.range(item, 0, pieces[0].length) ].concat(others);
    };

    return {
      split: split,
      subdivide: subdivide
    };

  }
);
