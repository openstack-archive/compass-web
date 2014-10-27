define([
  'underscore'
],
function (_) {
  'use strict';

  var index = [];
  var categories = {
    Combine: [],
    Transform: [],
    Calculate: [],
    Filter: [],
    Special: []
  };

  function addFuncDef(funcDef) {
    funcDef.params = funcDef.params || [];
    funcDef.defaultParams = funcDef.defaultParams || [];

    if (funcDef.category) {
      funcDef.category.push(funcDef);
    }
    index[funcDef.name] = funcDef;
    index[funcDef.shortName || funcDef.name] = funcDef;
  }

  addFuncDef({
    name: 'scaleToSeconds',
    category: categories.Transform,
    params: [{ name: 'seconds', type: 'int' }],
    defaultParams: [1],
  });

  addFuncDef({
    name: "holtWintersForecast",
    category: categories.Calculate,
  });

  addFuncDef({
    name: "holtWintersConfidenceBands",
    category: categories.Calculate,
    params: [{ name: "delta", type: 'int' }],
    defaultParams: [3]
  });

  addFuncDef({
    name: "holtWintersAberration",
    category: categories.Calculate,
    params: [{ name: "delta", type: 'int' }],
    defaultParams: [3]
  });

  addFuncDef({
    name: "nPercentile",
    category: categories.Calculate,
    params: [{ name: "Nth percentile", type: 'int' }],
    defaultParams: [95]
  });

  addFuncDef({
    name: 'sumSeries',
    shortName: 'sum',
    category: categories.Combine,
  });

  addFuncDef({
    name: 'averageSeries',
    shortName: 'avg',
    category: categories.Combine,
  });

  addFuncDef({
    name: 'isNonNull',
    category: categories.Combine,
  });

  addFuncDef({
    name: 'rangeOfSeries',
    category: categories.Combine
  });

  addFuncDef({
    name: 'percentileOfSeries',
    category: categories.Combine,
    params: [{ name: "n", type: "int" }, { name: "interpolate", type: "select", options: ["true", "false"] }],
    defaultParams: [95, "false"]
  });

  addFuncDef({
    name: 'sumSeriesWithWildcards',
    category: categories.Combine,
    params: [{ name: "node", type: "int" }],
    defaultParams: [3]
  });

  addFuncDef({
    name: 'maxSeries',
    shortName: 'max',
    category: categories.Combine,
  });

  addFuncDef({
    name: 'minSeries',
    shortName: 'min',
    category: categories.Combine,
  });

  addFuncDef({
    name: 'averageSeriesWithWildcards',
    category: categories.Combine,
    params: [{ name: "node", type: "int" }],
    defaultParams: [3]
  });

  addFuncDef({
    name: "alias",
    category: categories.Special,
    params: [{ name: "alias", type: 'string' }],
    defaultParams: ['alias']
  });

  addFuncDef({
    name: "aliasSub",
    category: categories.Special,
    params: [{ name: "search", type: 'string' }, { name: "replace", type: 'string' }],
    defaultParams: ['', '']
  });

  addFuncDef({
    name: "stacked",
    category: categories.Special,
    params: [{ name: "stack", type: 'string' }],
    defaultParams: ['stacked']
  });

  addFuncDef({
    name: "consolidateBy",
    category: categories.Special,
    params: [
      {
        name: 'function',
        type: 'string',
        options: ['sum', 'average', 'min', 'max']
      }
    ],
    defaultParams: ['max']
  });

  addFuncDef({
    name: "groupByNode",
    category: categories.Special,
    params: [
      {
        name: "node",
        type: "int",
        options: [1,2,3,4,5,6,7,8,9,10,12]
      },
      {
        name: "function",
        type: "string",
        options: ['sum', 'avg']
      }
    ],
    defaultParams: [3, "sum"]
  });

  addFuncDef({
    name: 'aliasByNode',
    category: categories.Special,
    params: [
      { name: "node", type: "int", options: [0,1,2,3,4,5,6,7,8,9,10,12] },
      { name: "node", type: "int", options: [0,-1,-2,-3,-4,-5,-6,-7], optional: true },
    ],
    defaultParams: [3]
  });

  addFuncDef({
    name: 'substr',
    category: categories.Special,
    params: [
      { name: "start", type: "int", options: [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,12] },
      { name: "stop", type: "int", options: [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,12] },
    ],
    defaultParams: [0, 0]
  });

  addFuncDef({
    name: 'sortByName',
    category: categories.Special
  });

  addFuncDef({
    name: 'sortByMaxima',
    category: categories.Special
  });

  addFuncDef({
    name: 'sortByMinima',
    category: categories.Special
  });

  addFuncDef({
    name: 'sortByTotal',
    category: categories.Special
  });

  addFuncDef({
    name: 'aliasByMetric',
    category: categories.Special,
  });

  addFuncDef({
    name: 'randomWalk',
    category: categories.Special,
    params: [{ name: "name", type: "string", }],
    defaultParams: ['randomWalk']
  });

  addFuncDef({
    name: 'countSeries',
    category: categories.Special
  });

  addFuncDef({
    name: 'constantLine',
    category: categories.Special,
    params: [{ name: "value", type: "int", }],
    defaultParams: [10]
  });

  addFuncDef({
    name: 'cactiStyle',
    category: categories.Special,
  });

  addFuncDef({
    name: 'keepLastValue',
    category: categories.Special,
    params: [{ name: "n", type: "int", }],
    defaultParams: [100]
  });

  addFuncDef({
    name: 'scale',
    category: categories.Transform,
    params: [{ name: "factor", type: "int", }],
    defaultParams: [1]
  });

  addFuncDef({
    name: 'offset',
    category: categories.Transform,
    params: [{ name: "amount", type: "int", }],
    defaultParams: [10]
  });

  addFuncDef({
    name: 'transformNull',
    category: categories.Transform,
    params: [{ name: "amount", type: "int", }],
    defaultParams: [0]
  });

  addFuncDef({
    name: 'integral',
    category: categories.Transform,
  });

  addFuncDef({
    name: 'derivative',
    category: categories.Transform,
  });

  addFuncDef({
    name: 'nonNegativeDerivative',
    category: categories.Transform,
    params: [{ name: "max value or 0", type: "int", }],
    defaultParams: [0]
  });

  addFuncDef({
    name: 'timeShift',
    category: categories.Transform,
    params: [{ name: "amount", type: "select", options: ['1h', '6h', '12h', '1d', '2d', '7d', '14d', '30d'] }],
    defaultParams: ['1d']
  });

  addFuncDef({
    name: 'summarize',
    category: categories.Transform,
    params: [{ name: "interval", type: "string" }, { name: "func", type: "select", options: ['sum', 'avg', 'min', 'max', 'last'] }],
    defaultParams: ['1h', 'sum']
  });

  addFuncDef({
    name: 'smartSummarize',
    category: categories.Transform,
    params: [{ name: "interval", type: "string" }, { name: "func", type: "select", options: ['sum', 'avg', 'min', 'max', 'last'] }],
    defaultParams: ['1h', 'sum']
  });

  addFuncDef({
    name: 'absolute',
    category: categories.Transform,
  });

  addFuncDef({
    name: 'hitcount',
    category: categories.Transform,
    params: [{ name: "interval", type: "string" }],
    defaultParams: ['10s']
  });

  addFuncDef({
    name: 'log',
    category: categories.Transform,
    params: [{ name: "base", type: "int" }],
    defaultParams: ['10']
  });

  addFuncDef({
    name: 'averageAbove',
    category: categories.Filter,
    params: [{ name: "n", type: "int", }],
    defaultParams: [25]
  });

  addFuncDef({
    name: 'averageBelow',
    category: categories.Filter,
    params: [{ name: "n", type: "int", }],
    defaultParams: [25]
  });

  addFuncDef({
    name: 'currentAbove',
    category: categories.Filter,
    params: [{ name: "n", type: "int", }],
    defaultParams: [25]
  });

  addFuncDef({
    name: 'currentBelow',
    category: categories.Filter,
    params: [{ name: "n", type: "int", }],
    defaultParams: [25]
  });

  addFuncDef({
    name: 'maximumAbove',
    category: categories.Filter,
    params: [{ name: "value", type: "int" }],
    defaultParams: [0]
  });

  addFuncDef({
    name: 'maximumBelow',
    category: categories.Filter,
    params: [{ name: "value", type: "int" }],
    defaultParams: [0]
  });

  addFuncDef({
    name: 'minimumAbove',
    category: categories.Filter,
    params: [{ name: "value", type: "int" }],
    defaultParams: [0]
  });

  addFuncDef({
    name: 'limit',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'mostDeviant',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [10]
  });

  addFuncDef({
    name: "exclude",
    category: categories.Filter,
    params: [{ name: "exclude", type: 'string' }],
    defaultParams: ['exclude']
  });

  addFuncDef({
    name: 'highestCurrent',
    category: categories.Filter,
    params: [{ name: "count", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'highestMax',
    category: categories.Filter,
    params: [{ name: "count", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'lowestCurrent',
    category: categories.Filter,
    params: [{ name: "count", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'movingAverage',
    category: categories.Filter,
    params: [{ name: "window size", type: "int" }],
    defaultParams: [10]
  });

  addFuncDef({
    name: 'movingMedian',
    category: categories.Filter,
    params: [{ name: "windowSize", type: "select", options: ['1min', '5min', '15min', '30min', '1hour'] }],
    defaultParams: ['1min']
  });

  addFuncDef({
    name: 'stdev',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }, { name: "tolerance", type: "int" }],
    defaultParams: [5,0.1]
  });

  addFuncDef({
    name: 'highestAverage',
    category: categories.Filter,
    params: [{ name: "count", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'lowestAverage',
    category: categories.Filter,
    params: [{ name: "count", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'removeAbovePercentile',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'removeAboveValue',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'removeBelowPercentile',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'removeBelowValue',
    category: categories.Filter,
    params: [{ name: "n", type: "int" }],
    defaultParams: [5]
  });

  _.each(categories, function(funcList, catName) {
    categories[catName] = _.sortBy(funcList, 'name');
  });

  function FuncInstance(funcDef) {
    this.def = funcDef;
    this.params = funcDef.defaultParams.slice(0);
    this.updateText();
  }

  FuncInstance.prototype.render = function(metricExp) {
    var str = this.def.name + '(';
    var parameters = _.map(this.params, function(value) {
      return _.isString(value) ? "'" + value + "'" : value;
    });

    if (metricExp !== undefined) {
      parameters.unshift(metricExp);
    }

    return str + parameters.join(',') + ')';
  };

  FuncInstance.prototype._hasMultipleParamsInString = function(strValue, index) {
    if (strValue.indexOf(',') === -1) {
      return false;
    }

    return this.def.params[index + 1] && this.def.params[index + 1].optional;
  };

  FuncInstance.prototype.updateParam = function(strValue, index) {
    // handle optional parameters
    // if string contains ',' and next param is optional, split and update both
    if (this._hasMultipleParamsInString(strValue, index)) {
      _.each(strValue.split(','), function(partVal, idx) {
        this.updateParam(partVal.trim(), idx);
      }, this);
      return;
    }

    if (strValue === '' && this.def.params[index].optional) {
      this.params.splice(index, 1);
    }
    else if (this.def.params[index].type === 'int') {
      this.params[index] = parseFloat(strValue, 10);
    }
    else {
      this.params[index] = strValue;
    }

    this.updateText();
  };

  FuncInstance.prototype.updateText = function () {
    if (this.params.length === 0) {
      this.text = this.def.name + '()';
      return;
    }

    var text = this.def.name + '(';
    _.each(this.def.params, function(param, index) {
      if (param.optional && this.params[index] === undefined) {
        return;
      }

      text += this.params[index] + ', ';
    }, this);
    text = text.substring(0, text.length - 2);
    text += ')';
    this.text = text;
  };

  return {
    createFuncInstance: function(funcDef) {
      if (_.isString(funcDef)) {
        if (!index[funcDef]) {
          throw { message: 'Method not found ' + name };
        }
        funcDef = index[funcDef];
      }
      return new FuncInstance(funcDef);
    },

    getFuncDef: function(name) {
      return index[name];
    },

    getCategories: function() {
      return categories;
    }
  };

});
