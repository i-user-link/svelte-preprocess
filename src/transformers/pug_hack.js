#!/usr/bin/env -S node --es-module-specifier-resolution=node --trace-uncaught --expose-gc --unhandled-rejections=strict
var CMD, bind, extract_li, main, split;

CMD = new Set('if else elif elseif key each await then catch html const debug'.split(' '));

extract_li = function(html, begin, end, replace) {
  var e, end_len, len, li, p, pre;
  len = begin.length;
  end_len = end.length;
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
  return li.join('');
};

split = (txt) => {
  var i, li, state, t;
  li = [];
  t = [];
  state = 0;
  for (i of txt) {
    if (state === 0) {
      if (i === '"') {
        state = 1;
        t.push(i);
        continue;
      }
      if (i === ' ') {
        li.push(t.join(''));
        t = [];
      } else {
        t.push(i);
      }
    } else if (state === 1) {
      if (i === '"') {
        if (t[t.length - 1] !== '\\') {
          state = 0;
        }
      }
      t.push(i);
    }
  }
  if (t.length) {
    li.push(t.join(''));
  }
  return li;
};

bind = (pug) => {
  return extract_li(pug, '(', ')', (txt) => {
    return split(txt).map((line) => {
      var attr, begin, end, pos, replace, set, wrap, 冒号, 等号;
      attr = line.trimStart();
      begin = line.length - attr.length;
      attr = attr.trimEnd();
      end = begin + attr.length;
      begin = line.slice(0, begin);
      end = line.slice(end);
      set = (txt) => {
        return line = begin + txt + end;
      };
      wrap = (txt, attr) => {
        return set(txt + '"{' + attr + '}"');
      };
      replace = (key, to) => {
        var at_pos, pos;
        at_pos = attr.indexOf(key) + key.length;
        pos = attr.indexOf('=', at_pos) + 1;
        return wrap(attr.slice(0, at_pos - 1) + to + ":" + attr.slice(at_pos, pos), attr.slice(pos));
      };
      if (attr) {
        if (attr.indexOf('="') < 0) {
          switch (attr.charAt(0)) {
            case '@':
              if (attr.charAt(1) === '&') {
                wrap('bind:this=', attr.slice(2));
              } else {
                等号 = attr.indexOf('=');
                if (等号 < 0) {
                  attr = attr.slice(1);
                  if (attr !== 'message') {
                    wrap('on:' + attr + '=', attr.split('|', 1)[0]);
                  } else {
                    set('on:' + attr);
                  }
                } else {
                  replace('@', 'on');
                }
              }
              break;
            case '&':
              wrap('bind:value=', attr.slice(1));
              break;
            case ':':
              set('{' + attr.slice(1) + '}');
              break;
            default:
              pos = attr.indexOf('&');
              等号 = attr.indexOf('=');
              if (pos > 0 && 等号 < 0) {
                wrap('bind:' + attr.slice(0, pos) + '=', attr.slice(pos + 1));
              } else {
                pos = attr.indexOf(':');
                if (pos > 0 && 等号 < 0) {
                  wrap(attr.slice(0, pos) + '=', attr.slice(pos + 1));
                } else {
                  冒号 = attr.indexOf(':');
                  if (冒号 > 0 && 冒号 < 等号) {
                    wrap(attr.slice(0, +等号 + 1 || 9e9), attr.slice(等号 + 1));
                  }
                }
              }
          }
        }
      }
      return line;
    }).join(' ');
  });
};

module.exports = main = (pug, filename, options) => {
  var cmd, i, j, len1, li, line, pos, ref, ts;
  filename = filename.slice(4, -7);
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
          if (cmd === 'elif') {
            cmd = 'elseif';
          }
          line = ''.padEnd(line.length - ts.length) + '+' + cmd + '(\'' + i.slice(pos + 1).replaceAll('\'', '\\\'') + '\')';
        }
      }
    }
    li.push(line);
  }
  return li.join('\n');
};

if (process.argv[1] === __filename) {
  console.log(main(`p >mail_or_phone
  |>test
  | > test
  | >mail >or >phone

+if 1

  form(
    @click={signin=1}
    @submit|preventDefault=test
    @submit|preventDefault
    src:url
    if null #:alt
    class:red=abc
    class:red
    @&ref
  )
  h2(class:red=abc)
  +elif x == 1
    b 3

form(value:test @click=hi @submit)
input(type="checkbox" checked&me autocomplete="{ up ? 'off' : null }")
Test(@message)

mixin p_input(placeholder)
  li
    input(
      type="text"
      placeholder=" "
    )&attributes(attributes)
    label(for!=attributes.id)!= placeholder
+p_input(>mail)(type="email" &mail)#i-user-mail`, "src/Index.svelte"));
}
