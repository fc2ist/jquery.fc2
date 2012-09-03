/*! jQuery FC2 Plugin - v0.1.2 - 2012-09-03
* http://fc2ist.blog.fc2.com/
* Copyright (c) 2012 @moi_fc2; Licensed MIT */

(function() {
  var Eyecatch, Lightbox, Pager, Scroll;

  $.fn.fc2 = (function() {

    function fc2() {
      var self;
      self = this;
      return {
        'eyecatch': function(options) {
          return self.each(function() {
            return new Eyecatch($(this), options);
          });
        },
        'pager': function(options) {
          return self.each(function() {
            return new Pager($(this), options);
          });
        },
        'lightbox': function(options) {
          new Lightbox(self, options);
          return self;
        }
      };
    }

    return fc2;

  })();

  $.fc2 = (function() {

    function fc2() {
      var self;
      self = this;
      return {
        'scroll': function(options) {
          new Scroll(options);
          return self;
        }
      };
    }

    return fc2;

  })();

  Eyecatch = (function() {
    var _build, _defaults, _reg;

    _defaults = {
      'className': 'img-eyecatch',
      'linkClassName': 'link-eyecatch',
      'enoData': 'eno',
      'titleData': 'title',
      'dataName': 'eyecatch',
      'fade': false,
      'fadeSpeed': 300
    };

    _reg = /(^blog-entry-\d+\.html)|([&\?]?no=\d+)/;

    _build = function() {
      var attr, eno, filename, img, optelem, src, title;
      if (this.target.data(this.config.dataName + '_on')) {
        return;
      }
      this.target.data(this.config.dataName + '_on', this);
      optelem = this.target.find('[data-' + this.config.dataName + ']:eq(0)');
      if (!optelem.length) {
        return;
      }
      this.eyecatch = optelem.data(this.config.dataName).split('%%');
      if (this.eyecatch.length < 1) {
        return;
      }
      filename = document.URL.substring(document.URL.lastIndexOf('/') + 1);
      src = this.eyecatch.length < 2 || _reg.test(filename) ? this.eyecatch[0] : this.eyecatch[1];
      img = $('<img />').attr({
        'src': src,
        'class': this.config.className
      });
      if (this.config.fade) {
        img.css('opacity', 0);
      }
      eno = this.target.data(this.config.enoData);
      title = this.target.data(this.config.titleData);
      if ((eno != null) && !_reg.test(filename)) {
        attr = {
          'href': 'blog-entry-' + eno + '.html',
          'class': this.config.linkClassName
        };
        if (title != null) {
          attr.title = title;
        }
        $('<a />').attr(attr).append(img).prependTo(this.target);
      } else {
        img.prependTo(this.target);
      }
      if (this.config.fade) {
        img.fadeTo(this.config.fadeSpeed, 1);
      }
      return optelem.remove();
    };

    function Eyecatch(target, options) {
      this.config = $.extend(_defaults, options);
      this.target = target;
      _build.apply(this);
    }

    return Eyecatch;

  })();

  Pager = (function() {
    var _bbq, _build, _defaults, _getURL, _info, _notPage, _notQuery;

    _defaults = {
      'range': 10,
      'totalData': 'total',
      'currentData': 'current',
      'dataName': 'pagination',
      'skip': true,
      'prev': "\u00ab",
      'next': "\u00bb",
      'className': null
    };

    _notPage = /(^blog-entry-\d+\.html)|(^archives\.html)/;

    _notQuery = /(&?no=\d+)|(&?all[=&]?)|(&?mode=edit(&.*)?)|(&?editor[=&]?)/;

    function Pager(target, options) {
      this.config = $.extend(_defaults, options);
      this.target = target;
      if (this.target.data(this.config.dataName)) {
        return;
      }
      this.target.data(this.config.dataName, this);
      this.info = $(window).data('pageinfo');
      if (!this.info) {
        this.info = _info(this.target.data(this.config.currentData));
        $(window).data('pageinfo', this.info);
      }
      if (!this.info) {
        return;
      }
      _build.apply(this);
    }

    _info = function(current) {
      var key, mat, obj, pagename, qStr, _i, _len, _ref, _ref1;
      obj = {};
      pagename = document.URL.substring(document.URL.lastIndexOf('/') + 1).split('#')[0];
      qStr = pagename.match(/\?(.+)/) ? RegExp.$1 : '';
      obj.query = _bbq(qStr);
      obj.filename = pagename.split('?')[0];
      _ref = ['q', 'tag', 'date', 'cat'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (obj.query[key]) {
          obj.area = key;
          obj.value = obj.query[key];
        }
      }
      if ((_notPage.test(obj.filename) && !obj.area) || _notQuery.test(qStr)) {
        return false;
      }
      if (!(obj.area != null) && !obj.filename) {
        return {
          'filename': '',
          'query': {},
          'area': 'page',
          'page': '0'
        };
      }
      if (!obj.area) {
        mat = obj.filename.match(/(([^-]+)-)?([^-]+)-(\d+)(-(\d+))?\.html$/);
        if (!(mat != null)) {
          return false;
        }
        if (mat[3] != null) {
          obj.prefix = mat[2];
        }
        if (mat[4] != null) {
          obj.no = mat[4];
        }
        obj.area = (_ref1 = mat[3]) != null ? _ref1 : mat[2];
        if (obj.area === 'page') {
          delete obj.no;
        }
      }
      if (current != null) {
        obj.page = current - 0;
      } else {
        obj.page = 1;
      }
      return obj;
    };

    _bbq = function(str) {
      var kv, obj, pair, _i, _len, _ref;
      obj = {
        'length': 0
      };
      _ref = str.split('&');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        kv = pair.split('=');
        if (kv[0] !== '') {
          obj[kv[0]] = kv.length > 1 ? kv[1] : '';
          ++obj.length;
        }
      }
      return obj;
    };

    _build = function() {
      var current, divider, half, href, k, list, max, min, next, next_href, ol, prev, prev_href, range, skip_next, skip_prev, total, _i, _ref;
      total = (_ref = this.target.data(this.config.totalData) - 0) != null ? _ref : 1;
      range = this.config.range - 0;
      current = this.info.page;
      if (total < 1) {
        total = 1;
      }
      if (current < 1) {
        current = 1;
      }
      if (range > total) {
        range = total;
      }
      half = Math.ceil(range / 2);
      if (current - half < 0) {
        min = 1;
        max = range;
      } else if (current + half >= total) {
        min = total - range + 1;
        max = total;
      } else {
        min = current - half + 1;
        max = current + half;
      }
      ol = $('<ol />');
      if (this.config.className != null) {
        ol.attr('class', this.config.className);
      }
      for (k = _i = min; min <= max ? _i <= max : _i >= max; k = min <= max ? ++_i : --_i) {
        list = $('<li>').appendTo(ol);
        if (k === current) {
          list.addClass('active');
          href = '#';
        } else {
          href = _getURL.apply(this, [k]);
        }
        $('<a>').attr('href', href).text(k).appendTo(list);
      }
      if (this.config.skip) {
        divider = $('<li class="disabled"><a href="#">...</a></li>');
        if (min > 1) {
          divider.prependTo(ol);
          skip_prev = $('<li>').prependTo(ol);
          $('<a>').attr('href', _getURL.apply(this, [1])).text('1').appendTo(skip_prev);
        }
        if (max < total) {
          divider.clone().appendTo(ol);
          skip_next = $('<li>').appendTo(ol);
          $('<a>').attr('href', _getURL.apply(this, [total])).text(total).appendTo(skip_next);
        }
      }
      prev = $('<li class="prev" />');
      next = $('<li class="next" />');
      prev_href = current > 1 ? _getURL.apply(this, [current - 1]) : '#';
      next_href = current < total ? _getURL.apply(this, [current + 1]) : '#';
      $('<a />').attr('href', prev_href).text(this.config.prev).appendTo(prev);
      $('<a />').attr('href', next_href).text(this.config.next).appendTo(next);
      if (prev_href === '#') {
        prev.addClass('disabled');
      }
      if (next_href === '#') {
        next.addClass('disabled');
      }
      ol.prepend(prev).append(next);
      return this.target.append(ol).on('click', 'a[href^=#]', function(event) {
        return false;
      });
    };

    _getURL = function(page) {
      var pat, v, _i, _len, _ref;
      if (!this.info.pattern) {
        if (this.info.value != null) {
          this.info.pattern = '/?' + this.info.area + '=' + this.info.value + '&page={{page}}';
        } else {
          pat = [];
          _ref = [this.info.prefix, this.info.area, this.info.no, '{{page}}'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            if ((v != null) && v.length >= 1) {
              pat.push(v);
            }
          }
          this.info.pattern = pat.join('-') + '.html';
        }
      }
      return this.info.pattern.replace('{{page}}', page - 1);
    };

    return Pager;

  })();

  Scroll = (function() {
    var _defaults;

    _defaults = {
      'speed': 300
    };

    function Scroll(speed) {
      speed = typeof speed === "function" ? speed(_defults.speed) : void 0;
      $(document).on('click', 'a[href^=#]', function(event) {
        var href, position, target;
        event.preventDefault();
        href = $(this).attr('href');
        target = $(href === '#' ? 'html' : href);
        if (target.length < 1) {
          target = $('html');
        }
        position = target.offset().top;
        return $('html,body').animate({
          scrollTop: position
        }, speed, function() {
          if (href !== '#') {
            return location.hash = href;
          }
        });
      });
    }

    return Scroll;

  })();

  Lightbox = (function() {
    var close, open, _build, _createBox, _createOverlay, _defaults, _load, _resize;

    _defaults = {
      'opacity': 0.75
    };

    function Lightbox(target, options) {
      if (target.data('lightbox')) {
        return;
      }
      this.config = $.extend(_defaults, options);
      this.target = target;
      _build.apply(this);
    }

    _build = function() {
      var self;
      self = this;
      _createOverlay.apply(this);
      _createBox.apply(this);
      return this.target.data('lightbox', true).on('click', function(event) {
        event.preventDefault();
        return open.apply(self, [$(this)]);
      }).css('outline', 0);
    };

    _createOverlay = function() {
      return this.overlay = $('<div />').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'opacity': this.config.opacity,
        'background-color': 'black',
        'width': '100%',
        'height': '100%',
        'display': 'none',
        'cursor': 'pointer',
        'z-index': 1000
      }).appendTo($('body')).on('click', $.proxy(close, this));
    };

    _createBox = function() {
      return this.box = $('<div />').css({
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
      }).appendTo($('body'));
    };

    open = function(target) {
      var _this = this;
      this.overlay.fadeIn(300);
      return _load(target.attr('href')).then(function(img) {
        var $img, title;
        if (window.navigator.appVersion.toLowerCase().indexOf('msie 8.') !== -1) {
          _this.box.width(img.width);
        }
        $img = $(img).css({
          'max-width': '100%',
          'height': 'auto',
          'cursor': 'pointer'
        }).on('click', $.proxy(close, _this));
        _this.box.empty().append(img).fadeIn(300);
        title = target.attr('title');
        if (title) {
          $('<div class="title" />').css({
            'padding-top': '10px'
          }).text(title).hide().appendTo(_this.box).delay(300).slideDown(300);
        }
        _resize.apply(_this);
        _this.box.css({
          'top': '50%',
          'left': '50%'
        });
        return $(window).on('resize', $.proxy(_resize, _this));
      }, function() {});
    };

    _resize = function() {
      _resize.i = _resize.i || 0;
      if (_resize.i++ % 2) {
        return;
      }
      return this.box.css({
        'margin-left': -parseInt(this.box.outerWidth() / 2),
        'margin-top': -parseInt(this.box.outerHeight() / 2)
      });
    };

    close = function() {
      this.overlay.fadeOut(200);
      this.box.fadeOut(200);
      return $(window).off('resize', $.proxy(_resize, this));
    };

    _load = function(url) {
      var dfd;
      dfd = new $.Deferred();
      $('<img />').on('load', function() {
        return dfd.resolve(this);
      }).attr('src', url);
      return dfd.promise();
    };

    return Lightbox;

  })();

}).call(this);
