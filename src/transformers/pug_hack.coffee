#!/usr/bin/env coffee

CMD = new Set('if else elseif key each await then catch html const debug'.split(' '))

extract_li = (html, begin, end, replace)->
  len = begin.length
  end_len = 1+end.length
  pre = p = 0

  li = []
  loop
    p = html.indexOf begin, p
    if p < 0
      li.push html[pre..]
      break
    p += len
    e = html.indexOf end,p
    if e < 0
      break
    li.push html[pre...p]
    li.push replace html[p...e]
    pre = e
    p = end_len + e
  console.log('-----')

  li.join ''

bind = (pug)=>
  extract_li(
    pug
    '('
    ')'
    (txt)=>
      txt.split(' ').map(
        (line)=>
          replace = (key, to)=>
            at_pos = line.indexOf(key)+key.length
            pos = line.indexOf('=',at_pos)+1
            line = line[...at_pos-1]+to+":"+line[at_pos...pos]+'"{'+line[pos..]+'}"'

          attr = line.trim()
          if attr
            if attr.indexOf('="')<0
              冒号 = line.indexOf(':')
              if 冒号 > 0
                等号 = line.indexOf('=')
                if 等号 > 0 and 冒号<等号
                  line = line[..等号]+'"{'+line[等号+1..]+'}"'
                  console.log '>',attr
              else if attr.startsWith('this=')
                pos = line.indexOf('this=')+5
                line = line[...pos]+'"{'+line[pos..]+'}"'
              else if attr.startsWith('@')
                replace '@','on'
              else if attr.startsWith(':')
                replace ':','bind'

          line
      ).join(' ')
  )




module.exports = main = (pug)=>
  li = []
  for line in bind(pug).split('\n')
    ts = line.trimStart()
    i = ts.trimEnd()
    if i.charAt(0) == '+'
      pos = i.indexOf(' ',2)
      if pos > 0
        cmd = i[1...pos]
        if CMD.has cmd
          line = ''.padEnd(line.length-ts.length)+i[...pos]+'(\''+i[pos+1..].replaceAll('\'','\\\'')+'\')'
    li.push line
  li.join('\n')


console.log main("""
+if 1

  form(on:submit|preventDefault="{ submit }")

  form(
    on:submit|preventDefault=submit style="color:#ff0"
  )

form(:value=test @click=hi)

form(bind:value=test)

svelte:component(this=expression)

ttt
""")
