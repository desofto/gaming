// подключение стороннего скрипта. выполняется через eval, так что отладке не подлежит
function include(src) {
  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.src = src;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore( po, s );
}

;( function($) {
  // добавление метода indexOf в массив (не во всех браузерах реализован)
  if( !Array.prototype.indexOf ){
    Array.prototype.indexOf = function(obj) {
      for( var i = 0; i < this.length; i++ ) {
        if( this[i] == obj ) return i;
      }
      return -1;
    }
  }
  // добавляет метод получения даты в текущей локали
  Date.prototype.toLocaleFormat = function(format) {
    var f = {
      y: this.getYear(),
      Y: this.getYear() + 1900,
      m: this.getMonth() + 1,
      d: this.getDate(),
      H: this.getHours(),
      M: this.getMinutes(),
      S: this.getSeconds()
    }
    for( k in f ) {
      format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
    }
    return format;
  };
  $.extend( $, {
    // получение GET переменных запроса из текущей ссылки
    getUrlVars: function() {
      var vars = [];
      var index = window.location.href.indexOf('?');
      if( index > 0 ) {
        var index2 = window.location.href.indexOf('#');
        if( index2 <= 0 ) index2 = window.location.href.length;
        var hash;
        var hashes = window.location.href.slice( index + 1, index2 ).split('&');
        for( var i = 0; i < hashes.length; i++ ) {
          hash = hashes[i].split('=');
          vars[ hash[0] ] = hash[1];
        }
      }
      return vars;
    },
    // получение якоря из текущей ссылки (после диеза)
    getUrlAnchor: function() {
      var index = window.location.href.indexOf('#');
      return( index > 0 ? window.location.href.slice( index + 1 ) : "" );
    },
    // получение чистой ссылки текущей страницы - без переменных и якоря
    getUrlClean: function() {
      var index1 = window.location.href.indexOf('?');
      if( index1 < 0 ) index1 = window.location.href.length;
      var index2 = window.location.href.indexOf('#');
      if( index2 < 0 ) index2 = window.location.href.length;
      var index = ( index1 < index2 ? index1 : index2 );
      return window.location.href.slice( 0, index );
    },
    // расширение для отправки POST-запроса и получения JSON ответа (просто укорачивание)
    postJSON: function( url, data, callback ) {
      $.post( url, data, callback, "JSON" );
    }
  } );
  $.extend( $.fn, {
    // при открытии страницы переключает таб на значение из якоря, при смене таба вызывает callback
    tabUrl: function( onchange ) {
      var self = this;
      var id = $.getUrlAnchor();
      if( id.length > 0 ) {
        var index = this.children('#'+id).index()-1;
        if( index >= 0 ) {
          self.children('.tabs-block').children('.tab').removeClass('active').eq(index).addClass('active');
          self.children('.tabs-content').hide().eq(index).show();
          if( onchange !== undefined ) {
            onchange(id);
          }
        }
      }
      self.children('.tabs-block').children('.tab').click( function() {
        var index = $(this).index();
        var id = self.children('.tabs-content').hide().eq(index).attr('id');
        var index = window.location.href.indexOf('#');
        if( index < 0 ) index = window.location.href.length;
        window.location.href = window.location.href.slice( 0, index ) + '#' + id;
        if( onchange !== undefined ) {
          onchange(id);
        }
      } );
    },
    // быстрая сортировка нод. например, строк таблицы
    sortElements: ( function() {
      var sort = [].sort;
      return function( comparator, getSortable ) {
        getSortable = getSortable || function(){ return this; };
        var placements = this.map( function() {
          var sortElement = getSortable.call(this),
              parentNode = sortElement.parentNode,
              nextSibling = parentNode.insertBefore(
                document.createTextNode(''),
                sortElement.nextSibling
              );
          return function() {
            if( parentNode === this ) {
              throw new Error( "You can't sort elements if any one is a descendant of another." );
            }
            parentNode.insertBefore(this, nextSibling);
            parentNode.removeChild(nextSibling);
          };
        } );
        return sort.call( this, comparator ).each( function(i) {
          placements[i].call(getSortable.call(this));
        } );
      };
    } )(),
    // цепляет обработчик на выбор из дерева
    treeviewSelect: function( delimiter, callback ) {
      if( callback === undefined ) {
        callback = delimiter;
        delimiter = undefined;
      }
      var self = this;
      $(self).on( 'click', 'a:not(.js-link)', function() {
        var span = $(this).parent('span');
        if( span.length <= 0 ) span = $(this);
        span.prev('div.hitarea').click();
        var id = $(this).closest('li').attr( 'id' );
        if( id !== undefined ) {
          if( delimiter !== undefined && delimiter.length > 0 ) {
            var arr = id.split(delimiter);
            if( arr.length > 1 ) id = arr[1]; else id = undefined;
          }
          if( id !== undefined ) {
            var mark = true;
            if( callback !== undefined ) mark = callback( id );
            if( mark !== false ) {
              $(self).find('a').css( 'font-weight', 'normal' );
              $(this).css( 'font-weight', 'bold' );
            }
          }
        }
      } );
    }
  } );
}($) );

;( function($) {
  $(document).ready( function() {
    // правила ограничения ввода для полей ввода
    $(document).on( 'keypress', '.rule_float, .rule-float', function(event) {
      if( event.which < 32 ) return;
      if( ( event.which < 48 || event.which > 57 ) && event.which != 46 && event.which != 45 ) {
        event.preventDefault();
      }
    } );
    // правила ограничения ввода для полей ввода
    $(document).on( 'keypress', '.rule_integer, .rule-integer', function(event) {
      if( event.which < 32 ) return;
      if( ( event.which < 48 || event.which > 57 ) && event.which != 45 ) {
        event.preventDefault();
      }
    } );
    // реакция на чекбокс "выбрать все"
    $(document).on( 'click', 'th input.select-all[type=checkbox]', function() {
      var table = $(this).closest('table');
      var index = $(this).closest('th').index();
      if( $(this).attr('checked') ) {
        table.find('input[type=checkbox]').not('.select-all').not(':checked').each( function() {
          if( $(this).closest('td').index() != index ) return;
          $(this).click();
        } );
      } else {
        table.find('input[type=checkbox]').not('.select-all').filter(':checked').each( function() {
          if( $(this).closest('td').index() != index ) return;
          $(this).click();
        } );
      }
    } );
    // разворачивание подпунктов в ячейках таблиц (вроде "удалить", "редактировать" и т.д.)
    $(document).on( 'click', 'div.name-link', function() {
      var nameOption = $(this).next('div.name-option');
      if( nameOption.css('visibility') == 'hidden' ) {
        $(this).closest('table').find('div.name-option').css( 'visibility', 'hidden' );
        nameOption.css( 'visibility', 'visible' );
      } else {
        nameOption.css( 'visibility', 'hidden' );
      }
    } );
  } );
}($) );

;( function($) {
  var validators = [];
  $.extend( $.fn, {
    // позволяет получить или установить значение любого поля любого типа.
    // не надо помнить типы полей, просто .value()
    value: function(value) {
      if( this.length <= 0 ) return;
      if( $(this).is('input[type=text]') ) {
        if( $(this).hasClass('datepicker') || $(this).hasClass('hasDatepicker') ) {
          if( value !== undefined ) {
            if( !( value instanceof Date ) ) {
              if( !value ) {
                $(this).val('');
                return this;
              }
              value = new Date( 1000 * value );
            }
            $(this).datepicker( 'setDate', value );
            return this;
          } else {
            var date = $(this).datepicker('getDate');
            if( date ) {
              return date.getTime() / 1000 - date.getTimezoneOffset() * 60;
            } else return undefined;
          }
        } else {
          if( value !== undefined ) {
            $(this).val( value );
            return this;
          } else return $(this).val();
        }
      } else if( $(this).is('input[type=hidden]') ) {
        if( value !== undefined ) {
          $(this).val( value );
          return this;
        } else return $(this).val();
      } else if( $(this).is('select') ) {
        if( value !== undefined ) {
          $(this).val( value );
          return this;
        } else return $(this).val();
      } else if( $(this).is('textarea') ) {
        if( value !== undefined ) {
          $(this).val( value );
          return this;
        } else return $(this).val();
      } else if( $(this).is('input[type=checkbox]') ) {
        if( value !== undefined ) {
          if( value ) $(this).attr( 'checked', 'checked' );
          else $(this).removeAttr('checked');
          $(this).change();
          return this;
        } else return( $(this).attr('checked') ? ( $(this).val() ? $(this).val() : true ): false );
      } else if( $(this).is('input[type=radio]') ) {
        if( value !== undefined ) {
          $(this).removeAttr('checked').filter('[value='+value+']').attr( 'checked', 'checked' );
          return this;
        } else {
          var el = $(this).filter(':checked');
          return ( el.length > 0 ? el.val() : '' );
        }
      } else if( $(this).get(0).nodeName.toLowerCase() == 'span' ) {
        if( value !== undefined ) {
          $(this).html(value);
          return this;
        } return $(this).html();
      } else if( $(this).get(0).nodeName.toLowerCase() == 'div' ) {
        if( value !== undefined ) {
          $(this).html(value);
          return this;
        } else return $(this).html();
      } else {
        alert( $(this).attr('id') );
      }
    },
    // задает или вызывает правило валидации поля. validator - функция, возвращает true/false
    validate: function( validator ) {
      var id = $(this).attr('id');

      var markInvalid = false;
      if( validator === true || validator === false ) {
        markInvalid = validator;
        validator = undefined;
      }

      if( validator === undefined ) {
        var valid = true;
        validator = validators[id];
        if( validator !== undefined ) {
          valid = $.proxy( validator, this, markInvalid )();
          var errorCss = $(this).attr('errorCss');
          if( errorCss !== undefined && errorCss.length > 0 ) {
            $(this).removeClass(errorCss);
            if( markInvalid && !valid ) $(this).addClass(errorCss);
            /*
            if( valid ) $(this).removeClass(errorCss);
            else if( markInvalid ) $(this).addClass(errorCss);
            */
          }
        }
        return valid;
      } else {
        validators[id] = validator;
        return this;
      }
    }
  } );
  // позволяет клонировать объекты и массивы
  function clone(src) {
    var dst = {};
    for( var key in src ) if( src.hasOwnProperty(key) ) {
      dst[key] = src[key];
    }
    return dst;
  }
  $.moco = $.moco || {};
  // валидатор для интервалов дат
  $.moco.dateValidate = function( datePickerFrom, datePickerTo ) {
    var validate = function() {
      var dateFrom = $(datePickerFrom).datepicker('getDate');
      var dateTo = $(datePickerTo).datepicker('getDate');
      return( dateFrom <= dateTo );
    }
    $(datePickerFrom).validate( validate );
    $(datePickerTo).validate( validate );
  }
  // лоадер -- показывает картинку загрузки
  $.moco.loading = new function() {
    var self = this;
    
    var counter = 0;
    
    var loading = $('<div></div>')
      .css( {
        'position': 'fixed',
        'background-color': 'transparent',
        'color': '#000000',
        'left': '50%',
        'top': '50%',
        'border': 'none',
        'z-index': '99999',
        'display': 'none'
      } )
      .addClass( 'div-loading' )
      .hide();
    
    $(document).ready( function() {
      $(loading).appendTo(document.body);
    } );
    
    // показать лоадер
    self.open = function() {
      counter++;
      $(loading)
        .css( 'left', ( $(window).width() / 2 - $(loading).width() / 2 ) + 'px' )
        .css( 'top', ( $(window).height() / 2 - $(loading).height() / 2 ) + 'px' )
        .css( 'width', $(loading).width() + 'px' )
        .css( 'height', $(loading).height() + 'px' )
        .show();
    }
    
    // скрыть лоадер. используется счетчик открытия-закрытия, чтобы не скрыть раньше времени
    self.close = function() {
      if( --counter <= 0 ) {
        $(loading).fadeOut();
      }
    }
    
    return self;
  }
  // базовый класс для форм, диалогов и визардов. реализует ведение полей, валидацию их
  // и изменение стиля для невалидных
  // в конструктор передается $('#formName')
  $.moco.classForm = function( form ) {
    var self = this; var me = self.parent = {};

    var _fields = [];
    // очистка списка полей
    self.init = me.init = function() {
      _fields = [];
    }
    // поиск поля на форме и добавление его в список валидации
    self.field = me.field = function( sectionName, fieldName ) {
      var section;
      if( fieldName === undefined ) {
        fieldName = sectionName;
        section = form;
      } else {
        section = $(form).find( '#' + sectionName + '-content' );
        if( section.length <= 0 ) {
          section = $(form).find( '#' + sectionName );
        }
      }
      var field;
      if( fieldName[0] == '#' ) {
        field = $(section).find( fieldName );
      } else {
        field = $(section).find( '[name=' + fieldName + ']' );
      }
      if( field.length < 1 ) return;
      var _validate = function() {
        self.validate();
      }
      field.change( _validate ).keyup( _validate );
      var fields = _fields[ sectionName ];
      if( fields === undefined ) {
        _fields[ sectionName ] = [];
        fields = _fields[ sectionName ];
      }
      fields.push( field );
      return field;
    }

    // проверка валидности всех полей и раскраска невалидных.
    // например, перед отправкой данных на сервер
    self.validate = me.validate = function( section, markInvalid ) {
      if( markInvalid === undefined && ( section === true || section === false ) ) {
        markInvalid = section;
        section = undefined;
      }
      var valid = true;
      for( var key in _fields ) if( _fields.hasOwnProperty(key) ) {
        if( section !== undefined && key !== section ) continue;
        var fields = _fields[key];
        for( i = 0; i < fields.length; i++ ) {
          var field = fields[i];
          if( !field.validate(markInvalid) ) valid = false;
        }
      }
      if( self.validator !== undefined && self.validator( section, markInvalid ) === false ) valid = false;
      return valid;
    }
    
    self.validator = me.validator = function( section, markInvalid ) { return true; }

    // выполняет запрос на сервер для получения данных. автоматически открывает лоадер-картинку
    self.json = me.json = function( json, params, callback, callbackError ) {
      $.moco.loading.open();
      if( params === undefined ) params = {};
      $.ajax( {
        type: "POST",
        url: "?ajax=" + json,
        data: params,
        success: function( answer ) {
          $.moco.loading.close();
          if( callback !== undefined ) {
            callback( answer );
          }
        },
        error: function() {
          $.moco.loading.close();
          if( callbackError === undefined ) {
            alert( "Error" );
          } else {
            callbackError( "Error" );
          }
        },
        dataType: 'json'
      } );
    }
    var saving = false;
    // отправляет данные на сервер и получает текстовый ответ, вызывает пользовательский обработчик
    // нормальным считается ответ "OK" после которого опционально идут данные. например, id созданого объекта
    // автоматически открывает лоадер-картинку
    self.ajax = me.ajax = function( ajax, params, callback, callbackError ) {
      if( saving ) return;
      saving = true;
      $.moco.loading.open();
      if( params === undefined ) params = {};
      $.ajax( {
        type: "POST",
        url: "?ajax=" + ajax,
        data: params,
        success: function( answer ) {
          $.moco.loading.close();
          if( answer.substr( 0, 2 ) == "OK" ) {
            if( callback !== undefined ) {
              callback( answer.substr( 2 ) );
            } else {
              if( self.close !== undefined ) self.close();
              var url = $(form).attr('ok');
              if( url !== undefined ) {
                window.location.href = url + answer.substr( 2 );
              }
            }
          } else {
            if( callbackError === undefined ) {
              alert( answer );
            } else {
              callbackError( answer );
            }
          }
          saving = false;
        },
        error: function() {
          $.moco.loading.close();
          if( callbackError === undefined ) {
            alert( "Error" );
          } else {
            callbackError( "Error" );
          }
          saving = false;
        },
        dataType: 'text'
      } );
    }
    
    var events = [];
    // на события можно навесить обработчики. будут срабатывать по событиям
    // для диалогов это 'open', 'ok' и 'close'. но могут быть и свои. вызываются они через fireEvent('myEvent')
    self.on = function ( event, handler ) {
      if( events[event] === undefined ) events[event] = [];
      events[event].push( handler );
    }
    self.fireEvent = function(event) {
      var e = events[event];
      if( e !== undefined ) {
        for( var i in e ) if( e.hasOwnProperty(i) ) {
          if( e[i]() === false ) return false;
        }
      }
      return true;
    }

    return self;
  }
  // базовый класс диалогов
  // реализует основные операции открытия, закрытия, загрузки с сервера
  // в конструктор передается $('#dialogName')
  $.moco.classDialog = function( dialog ) {
    var self = new $.moco.classForm( dialog );
    var parent = clone( self.parent ); var me = self.parent;

    $(dialog).modal( {
      'backdrop': true,
      'keyboard': false,
      'show': false
    } );

    $(dialog)
      //.dialog( 'option', 'closeOnEscape', false )
      .keydown( function(evt) {
        if( evt.keyCode === 27/*$.ui.keyCode.ESCAPE*/ ) {
          self.close();
          evt.stopPropagation();
          return false;
        } else if( evt.keyCode === 13/*$.ui.keyCode.RETURN*/ ) {
          //$(dialog).find('.modal-dialog .modal-content .modal-footer button.btn-primary').click();
          if( !$(document.activeElement).is('textarea') ) {
            self.ok();
            evt.stopPropagation();
            return false;
          }
        }                
      } );
    
    // загрузка текста диалога с сервера
    self.load = me.load = function( src, params, callback ) {
      $.moco.loading.open();
      $(dialog).load( src, params, function() {
        $.moco.loading.close();
        if( callback === undefined ) {
          me.open();
        } else callback();
      } );
    }
    
    // открытие диалога
    self.open = me.open = function() {
      if( !self.fireEvent('open') ) return;
      //$(dialog).dialog('open');
      self.init();
      $(dialog).modal('show');
      setTimeout( function() {
        $(dialog).find('.modal-dialog .modal-content .modal-body').find('input,textarea,select,button').filter(':visible:enabled:first').focus();
      }, 1000 );
    }
    // реакция на кнопку OK
    self.ok = me.ok = function() {
      if( !self.fireEvent('ok') ) return;
      self.close();
    }
    // реакция на кнопку Close
    self.close = me.close = function() {
      if( !self.fireEvent('close') ) return;
      //$(dialog).dialog('close');
      $(dialog).modal('hide');
    }
    
    // короткие вызовы установки обработчиков событий
    self.onOpen = function(handler) {
      self.on( 'open', handler );
    }

    self.onOK = function(handler) {
      self.on( 'ok', handler );
    }

    self.onClose = function(handler) {
      self.on( 'ok', handler );
    }
    
    return self;
  }
  //$.moco.classDialog.prototype = new $.moco.classForm();
  // базовый класс для визардов. реализует всю рутинную работу по валидации перехода по шагам и пр
  // в конструктор передается $('#wizardName')
  $.moco.classWizard = function( wizard ) {
    var self = new $.moco.classForm( wizard );
    var parent = clone( self.parent ); var me = self.parent;

    // поля с привязкой к шагам для валидации шагов
    self.field = me.field = function( sectionName, fieldName ) {
      var field = parent.field( sectionName, fieldName );
      if( field !== undefined && $(field).length > 0 ) {
        $(field).change( me.updateButtons ).keyup( me.updateButtons );
      }
      return field;
    }

    self.steps = [];
    $(wizard).find('div.fixing').children('div.fixing-el').each( function() {
      self.steps.push( $(this).attr('id') );
    } );
    self._step = self.steps[0];

    self.onStep = me.onStep = function(step) {}
    
    // обновляет доступность кнопок "назад", "далее", "закончить"
    // кнопки должны называться как #wizardName-back, #wizardName-next, #wizardName-finish
    self.updateButtons = me.updateButtons = function(markInvalid) {
      if( markInvalid !== true && markInvalid !== false ) markInvalid = undefined;
      var index = self.steps.indexOf( self._step );
      var wizardName = wizard.attr('id');
      var valid = self.validate( self._step, markInvalid );
      var back = $( '#' + wizardName + '-back');
      if( back.length > 0 ) {
        if( index > 0 ) back.show(); else back.hide();
        //back.cbutton( 'option', 'disabled', index <= 0 );
      }
      if( index < self.steps.length-1 ) {
        var finish = $( '#' + wizardName + '-finish');
        if( finish.length > 0 ) finish.hide();
        var next = $( '#' + wizardName + '-next');
        if( next.length > 0 ) next.show().cbutton( 'option', 'disabled', !valid );
      } else {
        var next = $( '#' + wizardName + '-next');
        if( next.length > 0 ) next.hide();
        var finish = $( '#' + wizardName + '-finish');
        if( finish.length > 0 ) finish.show().cbutton( 'option', 'disabled', !valid );
      }
    }

    self.setStep = me.setStep = function( step, reset ) {
      if( !self.validate(self._step) && self.steps.indexOf(step) > self.steps.indexOf(self._step) ) return;
      var oldStep = self._step;

      self._step = step;
      $(wizard).cwizard( 'setStep', step, reset );

      if( self._step != oldStep ) {
        self.onStep( step );
        self.updateButtons(false);
      }
    }
    self.onSetStep = me.onSetStep = function(step) {
      var oldStep = self._step;
      self._step = step;
      if( self.validate(oldStep) || self.steps.indexOf(step) < self.steps.indexOf(oldStep) ) {
        self.onStep(step);
        self.updateButtons(false);
      } else {
        self.setStep(oldStep);
        self.updateButtons(true);
      }
    }
    // переход на след. шаг. обычно по кнопке "next".
    self.stepNext = me.stepNext = function() {
      if( !self.validate( self._step, true ) ) return;
      
      var index = self.steps.indexOf( self._step );
      if( index < self.steps.length-1 ) {
        self.setStep( self.steps[ index+1 ] );
      } else self.ok();
    }
    self.stepBack = me.stepBack = function() {
      var index = self.steps.indexOf( self._step );
      if( index > 0 ) {
        self.setStep( self.steps[ index-1 ] );
      }
    }
    // вызывается по кнопке finish
    self.ok = me.ok = function() {
      if( !self.validate( self._step, true ) ) return;
      self.save();
    }
    // заглушка для реализации отправки данных на сервер. данные в этот момент проверены на валидность
    self.save = me.save = function() {
    }
    // реаликция на кнопку cancel: переход на страницу, указанную в визарде в атрибуте 'cancel'
    self.cancel = me.cancel = function() {
      var url = $(wizard).attr('cancel');
      if( url !== undefined ) {
        window.location.href = url;
      }
    }
    // первичная инициализация визарда. например, при открытии диалога
    self.init = me.init = function() {
      self.setStep( self.steps[0], true );
      self.updateButtons(false);
    }
    setTimeout( function() {
      me.init();
    }, 10 );
    
    return self;
  }
  //$.moco.classWizard.prototype = new $.moco.classForm();
}($) );

;( function($) {
  // базовый класс для графиков.
  // в конструктор передается div-контейнер, ссылка для получения данных и опции
  $.moco.classChart = function( container, ajax, options ) {
    var self = this;

    self.container = container;
    self.options = options;
    self.ajaxUrl = ajax;
    
    $(self.container)
      .css( 'width',     '900px' )
      .css( 'height',    '250px' )
      .css( 'margin',    '0 auto' )
    ;

    self.options.chart = self.options.chart || {};
    self.options.chart.renderTo = $(self.container).get(0);
    
    self.clear = function() {
      self.options.series = [];
    }
    
    self.serie = function( title, data, options ) {
      if( options === undefined ) options = {};
      options.name = title;
      options.data = data;
      self.options.series.push( options );
    }
    
    self.draw = function() {
      delete self.chart;
      self.chart = new Highcharts.Chart(self.options);
    }
    
    self.ajax = function( params, callback ) {
      $.postJSON( '?ajax=' + self.ajaxUrl, params, function( data, state, xhr ) {
        self.clear();
        callback( data, self.options, self.serie );
        self.draw();
        /*
        options.title.text = info.title;
        options.subtitle.text = info.subtitle;
        options.xAxis.title = { text: info.xAxisTitle };
        options.yAxis.title = { text: info.yAxisTitle };
        options.series = [];

        var data = info.data;
        var ser = [];
        for( i = 0; i < data.length; i++ ) {
          var item = data[i];
          ser.push(item);
        }
        options.series.push( { data: ser } );
        */
      } );
    }
    
    return self;
  }
}($) );

;( function($) {
  $(document).ready( function() {
    // реализация аплоада файлов через сабмит скрытой формы и ссылки вместо кнопки
    $('input[type=file].ajax-upload').change( function() {
      if( $(this).val().length <= 0 ) return;
      var form = $(this).closest('form');
      var name = $(form).attr('target');
      $(form).attr( 'action', window.location.href );
      $('div.'+name).hide().empty().height( '20px' ).addClass('loading').show();
      $(form).submit();
    } );
    $('iframe.upload').load( function() {
      var name = $(this).attr('name');
      $('div.'+name).hide().height('').removeClass('loading').html( $(this).contents().find('body').html() ).show();
      $('form[target='+name+']').find('input[type=file].ajax-upload').val('');
    } );
    $('.ajax-upload-link').click( function() {
      $(this).parent().find('form').find('input[type=file].ajax-upload').click();
    } );
    if( $.browser && $.browser.msie ) {
      $('.ajax-upload-link').hide();
    } else {
      $('input[type=file].ajax-upload').closest('form').hide();
    }
  } );
}($) );

;( function($) {
  // открытие первого уровня структуры сразу при загрузке страницы
  $(document).ready( function() {
    var func = function() {
      var div = $('#divDepartments >ul.treeview >li.hasChildren.expandable[id="."]');
      if( div.length > 0 ) {
        $(div).children('span').children('a').css( 'font-weight', 'bold' );
        $(div).children('div.hitarea').click();
      } else setTimeout( func, 100 );
    };
    setTimeout( func, 100 );
  } );
}($) );
