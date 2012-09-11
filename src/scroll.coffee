  class Scroll
  
    constructor:(@config)->
      speed = @config.speed
      $(document).on('click', 'a[href^=#]', (event)->
        event.preventDefault()
        elem = $(this)
        if elem.data('slide') then return
        href = elem.attr('href')
        target = $(if href == '#' then 'html' else href)
        if target.length < 1 then target = $('html')
        position = target.offset().top
        $('html,body').animate({scrollTop:position}, speed, ->
          if href != '#' then location.hash = href;
        )
      )
