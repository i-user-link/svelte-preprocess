#!/usr/bin/env coffee

CMD = new Set('if else elseif key each await then catch html const debug'.split(' '))

extract_li = (html, begin, end, replace)->
  len = begin.length
  end_len = end.length
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

  li.join ''

bind = (pug)=>
  extract_li(
    pug
    '('
    ')'
    (txt)=>
      txt.split(' ').map(
        (line)=>
          attr = line.trimStart()
          begin = line.length - attr.length
          attr = attr.trimEnd()
          end = begin + attr.length

          begin = line[...begin]
          end = line[end..]

          set = (txt)=>
            line = begin+txt+end

          wrap = (txt,attr)=>
            set txt+'"{'+attr+'}"'

          replace = (key, to)=>
            at_pos = attr.indexOf(key)+key.length
            pos = attr.indexOf('=',at_pos)+1
            wrap attr[...at_pos-1]+to+":"+attr[at_pos...pos],attr[pos..]

          if attr
            if attr.indexOf('="')<0
              switch attr.charAt(0)
                when '@'
                  if attr.charAt(1) == '&'
                    wrap 'bind:this=', attr[2..]
                  else
                    等号 = attr.indexOf '='
                    if 等号 < 0
                      attr = attr[1..]
                      if attr != 'message'
                        wrap 'on:'+attr+'=',attr.split('|',1)[0]
                      else
                        set 'on:'+attr
                    else
                      replace '@','on'
                when '&'
                  wrap 'bind:value=',attr[1..]
                when ':'
                  set '{'+attr[1..]+'}'
                else
                  pos = attr.indexOf('&')
                  等号 = attr.indexOf '='
                  if pos > 0 and 等号<0
                    wrap 'bind:'+attr[...pos]+'=', attr[pos+1..]
                  else
                    pos = attr.indexOf(':')
                    if pos > 0 and 等号 < 0
                      wrap attr[...pos]+'=', attr[pos+1..]
                    else
                      冒号 = attr.indexOf ':'
                      if 冒号 > 0 and 冒号<等号
                        wrap attr[..等号],attr[等号+1..]

          line
      ).join(' ')
  )



module.exports = main = (pug, filename, options)=>
  filename = filename[4..-8]

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


if process.argv[1] == __filename
  console.log main(
    """
p >mail_or_phone
  |>test
  | > test
  | >mail >or >phone

+if 1

  form(
    @submit|preventDefault=submit
    @submit|preventDefault
    src:url
    :alt
    class:red=abc
    @&ref
  )
  h2(class:red=abc)

form(value:test @click=hi @submit)
input(type="checkbox" checked&me)
Test(@message)

mixin p_input(placeholder)
  li
    input(
      type="text"
      placeholder=" "
    )&attributes(attributes)
    label(for!=attributes.id)!= placeholder
+p_input(>mail)(type="email" &mail)#i-user-mail
    """
    "src/Index.svelte"
)
