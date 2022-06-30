// Generated by CoffeeScript 2.6.1
(function() {
  //!/usr/bin/env coffee
  var CMD;

  CMD = new Set('if else elseif key each await then catch html const debug'.split(' '));

  module.exports = (pug) => {
    var cmd, i, j, len, li, line, pos, ref, ts;
    li = [];
    ref = pug.split('\n');
    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      ts = line.trimStart();
      i = ts.trimEnd();
      if (i.charAt(0) === '+') {
        pos = i.indexOf(' ', 2);
        if (pos > 0) {
          cmd = i.slice(1, pos);
          if (CMD.has(cmd)) {
            line = ''.padEnd(line.length - ts.length) + i.slice(0, pos) + '(\'' + i.slice(pos + 1).replaceAll('\'', '\\\'') + '\')';
          }
        }
      }
      li.push(line);
    }
    return li.join('\n');
  };

}).call(this);
