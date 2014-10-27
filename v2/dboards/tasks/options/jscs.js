module.exports = function(config) {
  return {
    src: [
      'Gruntfile.js',
      '<%= srcDir %>/app/**/*.js',
      '!<%= srcDir %>/app/panels/*/{lib,leaflet}/*',
      '!<%= srcDir %>/app/dashboards/*'
    ],
    options: {
      config: ".jscs.json",
    },
  };
};

/*
 "requireCurlyBraces": ["if", "else", "for", "while", "do", "try", "catch"],
    "requireSpaceAfterKeywords": ["if", "else", "for", "while", "do", "switch", "return", "try", "catch"],
    "disallowLeftStickedOperators": ["?", "+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
    "disallowRightStickedOperators": ["?", "+", "/", "*", ":", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
    "requireRightStickedOperators": ["!"],
    "requireLeftStickedOperators": [","],
   */