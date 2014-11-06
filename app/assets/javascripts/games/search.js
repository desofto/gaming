;( function($) {
  var classFormGames = function( form ) {
    var self = this;
    
    self.btnFilterAll = $('#games-search-filter-all');
    self.btnFilterActive = $('#games-search-filter-active');
    self.btnFilterDeleted = $('#games-search-filter-deleted');

    function _btnSelect( btn ) {
      $(btn).closest('.btn-group').find('button').removeClass( 'btn-primary' );
      $(btn).addClass( 'btn-primary' );
    }
    
    self.btnFilterAll.click( function() {
      _btnSelect( this );
      self.reload( 'all' );
    } );
    self.btnFilterActive.click( function() {
      _btnSelect( this );
      self.reload( 'active' );
    } );
    self.btnFilterDeleted.click( function() {
      _btnSelect( this );
      self.reload( 'deleted' );
    } );
    
    var stFilter = 'all';
    self.reload = function( filter ) {
      if( filter !== undefined ) stFilter = filter;
      $.gaming.gridLoad( form, { filter: stFilter } );
    }
    
    return self;
  }
  var classDialogGameCreate = function( dialog ) {
    var self = new $.moco.classDialog( dialog );
    
    self.editName = self.field( '#game_name' );
    self.editName.validate( function() {
      return $(this).value().length > 0;
    } );
    
    self.open = function() {
      self.editName.value('');
      self.parent.open();
    }
    
    self.ok = function() {
      if( !self.validate(true) ) return;
      var form = $(dialog).find('form');
      $.post( form.attr('action'), form.serialize(), function(answer) {
        if( answer == "OK" ) {
          self.parent.ok();
        } else alert( answer );
      } );
    }

    return self;
  }
  var classDialogGameDelete = function( dialog ) {
    var self = new $.moco.classDialog( dialog );
    
    self.open = function(id) {
      $(dialog).find('.modal-dialog .modal-content .modal-body').load( "/games/modal?view=game/delete&game=" + id, function() {
        self.parent.open();
      } );
    }
    
    self.ok = function() {
      if( !self.validate(true) ) return;
      var form = $(dialog).find('form');
      $.post( form.attr('action'), form.serialize(), function(answer) {
        if( answer == "OK" ) {
          self.parent.ok();
        } else alert( answer );
      } );
    }

    return self;
  }
  $(document).ready( function() {
    $.gaming.frmGames = new classFormGames( '#frmGames' );
    $.gaming.dlgGameCreate = new classDialogGameCreate( $('#dlgGameCreate') );
    $.gaming.dlgGameDelete = new classDialogGameDelete( $('#dlgGameDelete') );
    $('#games-game-create').click( function() {
      $.gaming.dlgGameCreate.open();
    } );
    $.gaming.dlgGameCreate.on( 'ok', function() {
      $.gaming.frmGames.reload();
    } );
    $('.games').on( 'click', 'button.delete', function() {
      $.gaming.dlgGameDelete.open( $(this).attr('data-game-id') );
    } );
    $.gaming.dlgGameDelete.on( 'ok', function() {
      $.gaming.frmGames.reload();
    } );
  } );
}($) );