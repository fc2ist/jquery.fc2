  class Pager
    
    _notPage = /(^blog-entry-\d+\.html)|(^archives\.html)/
    _notQuery = /(&?no=\d+)|(&?all[=&]?)|(&?mode=edit(&.*)?)|(&?editor[=&]?)/
  
    constructor:(target, @config)->
      @target = target
  
      if @target.data(@config.dataName) then return
      @target.data(@config.dataName, this)
      
      @info = $(window).data('pageinfo')
      if !@info
        @info = _info(@target.data(@config.currentData))
        $(window).data('pageinfo', @info)
      if !@info then return
  
      _build.apply(this)
  
    _info = (current)->
      obj = {}
      
      pagename = document.URL.substring(document.URL.lastIndexOf('/') + 1).split('#')[0]
      
      qStr = if pagename.match(/\?(.+)/) then RegExp.$1 else ''
      obj.query = _bbq(qStr)
      obj.filename = pagename.split('?')[0]
      
      for key in ['q', 'tag', 'date', 'cat']
        if obj.query[key]
          obj.area = key
          obj.value = obj.query[key]
  
      if (_notPage.test(obj.filename) && !obj.area) || _notQuery.test(qStr)
        return false
  
      if !obj.area? && !obj.filename
        return {
          'filename': '',
          'query': {},
          'area': 'page',
          'page': '0'
        }
              
      if !obj.area
        mat = obj.filename.match(/(([^-]+)-)?([^-]+)-(\d+)(-(\d+))?\.html$/)
        if !mat? then return false
        if mat[3]? then obj.prefix = mat[2]
        if mat[4]? then obj.no = mat[4]
        obj.area = mat[3] ? mat[2]
        if obj.area == 'page' then delete obj.no
  
      if current? then obj.page = current-0
      else obj.page = 1
   
      return obj
    
    _bbq = (str)->
      obj =
        'length': 0
      for pair in str.split('&')
        kv = pair.split('=')
        if kv[0] != ''
          obj[kv[0]] = if kv.length > 1 then kv[1] else ''
          ++obj.length
      return obj
  
    _build = ->
      total = @target.data(@config.totalData)-0 ? 1
      range = @config.range-0
      current = @info.page
      
      if total < 1 then total = 1
      if current < 1 then current = 1
      
      if range > total then range = total
      half = Math.ceil(range/2)
  
      if current - half < 0
        min = 1
        max = range
      else if current + half >= total
        min = total - range + 1
        max = total
      else
        min = current - half + 1
        max = current + half
  
      ol = $('<ul />')
      if @config.className?
        ol.attr('class', @config.className)
  
      for k in [min..max]
        list = $('<li>').appendTo(ol)
        if k == current
          list.addClass('active')
          href = '#'
        else
          href = _getURL.apply(this,[k])
        $('<a>').attr('href', href).text(k).appendTo(list)
      
      if @config.skip
        divider = $('<li class="disabled"><a href="#">...</a></li>')
        if min > 1
          divider.prependTo(ol)
          skip_prev = $('<li>').prependTo(ol)
          $('<a>').attr('href', _getURL.apply(this,[1])).text('1').appendTo(skip_prev)
        if max < total
          divider.clone().appendTo(ol)
          skip_next = $('<li>').appendTo(ol)
          $('<a>').attr('href', _getURL.apply(this,[total])).text(total).appendTo(skip_next)
  
      prev = $('<li class="prev" />')
      next = $('<li class="next" />')
      prev_href = if current > 1 then _getURL.apply(this,[current-1]) else '#' 
      next_href = if current < total then _getURL.apply(this,[current+1]) else '#' 
      $('<a />').attr('href', prev_href).text(@config.prev).appendTo(prev)
      $('<a />').attr('href', next_href).text(@config.next).appendTo(next)
      if prev_href == '#' then prev.addClass('disabled')
      if next_href == '#' then next.addClass('disabled')
      ol.prepend(prev).append(next)
      
      @target.append(ol)
      .on('click', 'a[href^=#]', (event)->
        return false
      )
  
    _getURL = (page)->
      if !@info.pattern      
        if @info.value?
          @info.pattern = '/?' + @info.area + '=' + @info.value + '&page={{page}}'
        else
          pat = []
          for v in [@info.prefix, @info.area, @info.no, '{{page}}']
            if v? && v.length >= 1 then pat.push(v)
          @info.pattern = pat.join('-') + '.html'
      return @info.pattern.replace('{{page}}', page - 1)
