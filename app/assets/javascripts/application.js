// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap
//= require classes
//= require wice_grid
//= requi re_tree .

;( function($) {
  $.gaming = $.gaming || {};
}($) );

;( function($) {
  $.gaming.gridLoad = function( grid, data, url ) {
    var id = $(grid).attr('id');
    if( url === undefined && typeof data != 'object' ) {
      url = data;
      data = undefined;
    }
    if( url === undefined ) {
      url = $(grid).attr('url');
    }
    if( url === undefined ) {
      url = window.location.href;
    }
    if( data === undefined ) data = {};
    $(grid).addClass('loading');
    data.ajax = id;
    $.get( url, data, function( table ) {
      table = '<div>' + table + '</div>';
      grid2 = $( '#'+id, table );
      $(grid2).attr( 'url', url );
      $(grid).replaceWith( grid2 );
    } );
  }
  $(document).on( 'click', '.wice-grid-container table thead a', function(event) {
    $.gaming.gridLoad( $(this).closest('.wice-grid-container'), $(this).attr('href') );
    event.preventDefault();
    event.stopPropagation();
    return false;
  } );    
  $(document).on( 'click', '.wice-grid-container table tfoot .pagination a', function(event) {
    $.gaming.gridLoad( $(this).closest('.wice-grid-container'), $(this).attr('href') );
    event.preventDefault();
    event.stopPropagation();
    return false;
  } );    
}($) );