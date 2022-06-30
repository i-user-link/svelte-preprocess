#!/usr/bin/env coffee

CMD = new Set('if else elseif key each await then catch html const debug'.split(' '))

export default main = (pug)=>
  li = []
  for line in pug.split('\n')
    ts = line.trimStart()
    i = ts.trimEnd()
    if i.charAt(0) == '+'
      pos = i.indexOf(' ',2)
      if pos > 0
        cmd = i[1...pos]
        if CMD.has cmd
          line = ''.padEnd(line.length-ts.length)+i[...pos]+'(\''+i[pos+1..].replaceAll('\'','\\\'')+'\')'
    li.push line
  return li.join('\n')
