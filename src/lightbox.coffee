  class Lightbox
  
    constructor:(target, @config)->
      if target.data('lightbox') then return
      @target = target
      _build.apply(this)
    
    _build = ->
      self = this
      _createOverlay.apply(this)
      _createBox.apply(this)
      @target.data('lightbox', true)
      .on('click', (event)->
        event.preventDefault()
        open.apply(self, [$(this)])
      )
      .css('outline', 0)
    
    _createOverlay = ->
      @overlay = $('<div />').css(
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'opacity': @config.opacity,
        'background-color': 'black',
        'width': '100%',
        'height': '100%',
        'display': 'none',
        'cursor': 'pointer',
        'z-index': 1000
      ).appendTo($('body'))
      .on('click', $.proxy(close, this))
      
    _createBox = ->
      @box = $('<div />').css(
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'background-color': 'white',
        'padding': '10px',
        'display': 'none',
        'z-index': 1001,
        '-webkit-border-radius': '6px',
        '-moz-border-radius': '6px',
        '-ms-border-radius': '6px',
        '-o-border-radius': '6px',
        'border-radius': '6px'
      ).appendTo($('body'))
    
    open = (target)->
      @overlay.fadeIn(300)
      _load(target.attr('href')).then((img)=>
        if window.navigator.appVersion.toLowerCase().indexOf('msie 8.') != -1
          @box.width(img.width)
  
        $img = $(img).css(
          'max-width': '100%',
          'height': 'auto',
          'cursor': 'pointer'
        )
        .on('click', $.proxy(close, this))
        @box.empty().append(img).fadeIn(300)
        
        title = target.attr('title')
        if title
          $('<div class="title" />')
          .css(
            'padding-top': '10px'
          )
          .text(title)
          .hide().appendTo(@box).delay(300).slideDown(300)
          
        _resize.apply(this)
        @box.css(
          'top': '50%',
          'left': '50%'
        )
        $(window).on('resize', $.proxy(_resize, this))
  
      , ->
        return
      )
  
    _resize = ->
      _resize.i = _resize.i || 0
      if _resize.i++ % 2 then return
      @box.css(
        'margin-left': - parseInt(@box.outerWidth()/2),
        'margin-top': - parseInt(@box.outerHeight()/2)
      )
  
    close = ->
      @overlay.fadeOut(200)
      @box.fadeOut(200)
      $(window).off('resize', $.proxy(_resize, this))
  
    _load = (url)->
      dfd = new $.Deferred()
      $('<img />')
      .on('load', ->
        dfd.resolve(this)
      )
      .attr('src', url)
      return dfd.promise()