  class $.fn.fc2
    constructor:->
      self = this
      return {
        'eyecatch': (options)->
          return self.each(->
            new Eyecatch($(this), options)
          )
        ,
        'pager': (options)->
          return self.each(->
            new Pager($(this), options)
          )
        ,
        'lightbox': (options)->
          new Lightbox(self, options)
          return self
      }
  
  class $.fc2
    constructor:->
      self = this
      return {
        'scroll': (options)->
          new Scroll(options)
          return self
      }
