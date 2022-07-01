// Generated by CoffeeScript 2.6.1
(function() {
  //!/usr/bin/env coffee
  var CMD, bind, extract_li, main;

  CMD = new Set('if else elseif key each await then catch html const debug'.split(' '));

  extract_li = function(html, begin, end, replace) {
    var e, end_len, len, li, p, pre;
    len = begin.length;
    end_len = 1 + end.length;
    pre = p = 0;
    li = [];
    while (true) {
      p = html.indexOf(begin, p);
      if (p < 0) {
        li.push(html.slice(pre));
        break;
      }
      p += len;
      e = html.indexOf(end, p);
      if (e < 0) {
        break;
      }
      li.push(html.slice(pre, p));
      li.push(replace(html.slice(p, e)));
      pre = e;
      p = end_len + e;
    }
    console.log('-----');
    return li.join('');
  };

  bind = (pug) => {
    return extract_li(pug, '(', ')', (txt) => {
      return txt.split(' ').map((line) => {
        var attr, pos, replace, 冒号, 等号;
        replace = (key, to) => {
          var at_pos, pos;
          at_pos = line.indexOf(key) + key.length;
          pos = line.indexOf('=', at_pos) + 1;
          return line = line.slice(0, at_pos - 1) + to + ":" + line.slice(at_pos, pos) + '"{' + line.slice(pos) + '}"';
        };
        attr = line.trim();
        if (attr) {
          if (attr.indexOf('="') < 0) {
            冒号 = line.indexOf(':');
            if (冒号 > 0) {
              等号 = line.indexOf('=');
              if (等号 > 0 && 冒号 < 等号) {
                line = line.slice(0, +等号 + 1 || 9e9) + '"{' + line.slice(等号 + 1) + '}"';
                console.log('>', attr);
              }
            } else if (attr.startsWith('this=')) {
              pos = line.indexOf('this=') + 5;
              line = line.slice(0, pos) + '"{' + line.slice(pos) + '}"';
            } else if (attr.startsWith('@')) {
              replace('@', 'on');
            } else if (attr.startsWith(':')) {
              replace(':', 'bind');
            }
          }
        }
        return line;
      }).join(' ');
    });
  };

  module.exports = main = (pug) => {
    var cmd, i, j, len1, li, line, pos, ref, ts;
    li = [];
    ref = bind(pug).split('\n');
    for (j = 0, len1 = ref.length; j < len1; j++) {
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

  console.log(main(`+if 1

  form(on:submit|preventDefault="{ submit }")

  form(
    on:submit|preventDefault=submit style="color:#ff0"
  )

form(:value=test @click=hi)

form(bind:value=test)

svelte:component(this=expression)

ttt`));

}).call(this);
