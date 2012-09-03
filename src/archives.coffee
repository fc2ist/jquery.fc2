class Archives
  _defaults =
    'border': 12,
    'lang': 'ja'

  constructor:(target, options)->
    if target.data('archives') then return
    @target = target
    @config = $.extend(_defaults, options)
    target.data('archives', true)
    _build.apply(this)
    
  _build = ->
    f1 = @target.children('li')
    if f1.length <= @config.border then return
    reg = /(\d{4})[^\d]*(\d{2})[^\d]*(\d+)?/
    year = {}
    f1.each(->
      str = $(this).text()
      pat = str.match(reg)
      y = pat[1]
      m = pat[2]
      cnt = pat[3]
      year[y] = year[y] ? $('<ul class="dropdown-menu" />')
      $(this).data('month', m)
      $(this).data('total', cnt)
      year[y].append(this)
      if year[y].data('total')
        year[y].data('total', year[y].data('total') - 0 + cnt)
      else
        year[y].data('total', 0)
    )
    for y, item of year
      $('<li class="dropdown-submenu">')
      .append( $('<a href="#" />').text(y) )
      .append(item)
      .appendTo(@target)
    