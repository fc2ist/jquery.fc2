  _defaults =
    'eyecatch':
      'className': 'img-eyecatch',
      'linkClassName': 'link-eyecatch',
      'enoData': 'eno',
      'titleData': 'title',
      'dataName': 'eyecatch',
      'fade': false,
      'fadeSpeed': 300,
      'carousel': '#index-carousel',
    ,'pager':
      'range': 10,
      'totalData': 'total',
      'currentData': 'current',
      'dataName': 'pagination',
      'skip': true,
      'prev': "\u00ab",
      'next': "\u00bb",
      'className': null
    ,'lightbox':
      'opacity': 0.75
    ,'scroll':
      'speed': 300

  class $.fn.fc2
    constructor:->
      self = this
      return {
        'eyecatch': (options)->
          config = $.extend(options, _defaults.eyecatch)
          $(config.carousel).each(->
            $items = $('.item', this)
            $items.eq(0).addClass('active')
            $items.each(->
              $item = $(this)
              eno = $item.data('target')
              $post = self.filter('[data-eno="' + eno + '"]')
              if !$post.length then return
              optelem = $post.find('[data-' + config.dataName + ']:eq(0)')
              if !optelem.length then return
              eyecatch = optelem.data(config.dataName).split('%%')
              if !eyecatch.length then return
              $('img.' + config.className, $item).attr('src', eyecatch.shift())
            )
          ).show().addClass('in')
          return self.each(->
            new Eyecatch($(this), config)
          )
        ,
        'pager': (options)->
          config = $.extend(options, _defaults.pager)
          return self.each(->
            new Pager($(this), config)
          )
        ,
        'lightbox': (options)->
          config = $.extend(options, _defaults.lightbox)
          new Lightbox(self, config)
          return self
      }

  class $.fc2
    constructor:->
      self = this
      return {
        'scroll': (options)->
          config = $.extend(options, _defaults.scroll)
          new Scroll(config)
          return self
      }
