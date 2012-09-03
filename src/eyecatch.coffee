class Eyecatch

  _defaults =
    'className': 'img-eyecatch',
    'linkClassName': 'link-eyecatch',
    'enoData': 'eno',
    'titleData': 'title',
    'dataName': 'eyecatch',
    'fade': false,
    'fadeSpeed': 300
    
  _reg = /(^blog-entry-\d+\.html)|([&\?]?no=\d+)/
  
  _build = ->
    if @target.data(@config.dataName + '_on') then return
    @target.data(@config.dataName + '_on', this)
    optelem = @target.find('[data-' + @config.dataName + ']:eq(0)')
    if !optelem.length then return
    @eyecatch = optelem.data(@config.dataName).split('%%')
    if @eyecatch.length < 1 then return
    filename = document.URL.substring(document.URL.lastIndexOf('/') + 1)
    src = if @eyecatch.length < 2 || _reg.test(filename) then @eyecatch[0] else @eyecatch[1]
    img = $('<img />')
    .attr(
      'src': src,
      'class': @config.className
    )
    if @config.fade
      img.css('opacity', 0)
    eno = @target.data(@config.enoData)
    title = @target.data(@config.titleData)
    if eno? && !_reg.test(filename)
      attr =
        'href': 'blog-entry-' + eno + '.html',
        'class': @config.linkClassName
      if title? then attr.title = title
      $('<a />').attr(attr).append(img).prependTo(@target)
    else
      img.prependTo(@target)

    if @config.fade
      img.fadeTo(@config.fadeSpeed, 1)
      
    optelem.remove()

  constructor:(target, options)->
    @config = $.extend(_defaults, options)
    @target = target
    _build.apply(this)
