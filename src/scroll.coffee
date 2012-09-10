  class Scroll
    _defaults =
      'speed': 300
  
    constructor:(speed)->
      speed = speed? _defults.speed
      $(document).on('click', 'a[href^=#]', (event)->
        event.preventDefault()
        href = $(this).attr('href')
        target = $(if href == '#' then 'html' else href)
        if target.length < 1 then target = $('html')
        position = target.offset().top
        $('html,body').animate({scrollTop:position}, speed, ->
          if href != '#' then location.hash = href;
        )
      )
