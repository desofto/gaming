classDialogGameRoundEdit = ( dialog ) ->
  self = new $.moco.classDialog dialog

  self.init = ->
    self.parent.init()
    self.editName = self.field '#round_name'
    self.editName.validate ->
      $(this).value().length > 0
    self.selectStatus = self.field '#round_status'

  self.open = ( gameId, roundId ) ->
    gameId = '' if gameId == undefined
    roundId = '' if roundId == undefined
    $(dialog).find('.modal-dialog .modal-content .modal-body').load "/games/modal?view=" + $(dialog).attr('view') + "&game=" + gameId + "&round=" + roundId, ->
      if roundId.length
        $(dialog).find('.modal-dialog .modal-content .modal-header .modal-title').text $(dialog).attr('title-edit')
        $(dialog).find('[title-edit]').each ->
          $(this).text $(this).attr('title-edit')
      else
        $(dialog).find('.modal-dialog .modal-content .modal-header .modal-title').text $(dialog).attr('title-create')
        $(dialog).find('[title-create]').each ->
          $(this).text $(this).attr('title-create')
      self.parent.open()

  self.ok = ->
    return unless self.validate(true)
    form = $(dialog).find('form')
    $.post form.attr('action'), form.serialize(), (answer) ->
      if answer == "OK"
        self.parent.ok()
      else
        alert answer
  self

classGridGameRounds = ( grid ) ->
  self = new $.moco.classForm grid

  btnFilterAll = $('#games-game-filter-all')
  btnFilterActive = $('#games-game-filter-active')
  btnFilterClosed = $('#games-game-filter-closed')

  btnGameRoundAdd = $('#games-game-round-add')
  btnGameRoundAdd.click ->
    $.gaming.dlgGameRoundEdit.open $(this).attr('data-game-id')

  _btnSelect = ( btn ) ->
    $(btn).closest('.btn-group').find('button').removeClass( 'btn-primary' )
    $(btn).addClass( 'btn-primary' )
    $(btn).blur()

  btnFilterAll.click ->
    _btnSelect( this )
    self.reload( 'all' )

  btnFilterActive.click ->
    _btnSelect( this )
    self.reload( 'active' )

  btnFilterClosed.click ->
    _btnSelect( this )
    self.reload( 'closed' )

  _stFilter = 'all'
  self.reload = ( filter ) ->
    _stFilter = filter unless filter == undefined
    $.gaming.gridLoad grid, {
      filter: _stFilter,
    }

  $(grid).parent().on 'click', 'table tbody button.edit', ->
    $.gaming.dlgGameRoundEdit.open 0, $(this).attr('data-game-round-id')

  self

classDialogGameEdit = ( dialog ) ->
  self = new $.moco.classDialog dialog

  self.init = ->
    self.parent.init()
    self.editName = self.field '#game_name'
    self.editName.validate ->
      $(this).value().length > 0

  self.open = ( id ) ->
    $(dialog).find('.modal-dialog .modal-content .modal-body').load "/games/modal?view=" + $(dialog).attr('view') + "&game=" + id, () ->
      self.parent.open()

  self.ok = ->
    return unless self.validate(true)
    form = $(dialog).find('form')
    $.post form.attr('action'), form.serialize(), (answer) ->
      if answer == "OK"
        self.parent.ok()
      else
        alert answer
  self

classDialogGameDelete = ( dialog ) ->
  self = new $.moco.classDialog( dialog )

  self.open = ( id ) ->
    $(dialog).find('.modal-dialog .modal-content .modal-body').load "/games/modal?view=" + $(dialog).attr('view') + "&game=" + id, () ->
      self.parent.open()

  self.ok = ->
    return unless self.validate(true)
    form = $(dialog).find 'form'
    $.post form.attr('action'), form.serialize(), (answer) ->
      if answer == "OK"
        self.parent.ok()
      else
        alert( answer )
  self

$(document).on 'ready page:load', ->
  return unless $('body').attr('path') == 'games/show'

  $.gaming.gridGameRounds = new classGridGameRounds '#gridGameRounds'

  $.gaming.dlgGameRoundEdit = new classDialogGameRoundEdit '#dlgGameRoundEdit'
  $.gaming.dlgGameRoundEdit.on 'ok', () ->
    $.gaming.gridGameRounds.reload()

  $.gaming.dlgGameEdit = new classDialogGameEdit '#dlgGameEdit'
  $.gaming.dlgGameEdit.on 'ok', () ->
    $('#game-name').value $.gaming.dlgGameEdit.editName.value()
  $('#game-edit').click () ->
    $.gaming.dlgGameEdit.open $(this).attr('data-game-id')

  $.gaming.dlgGameDelete = new classDialogGameDelete '#dlgGameDelete'
  $.gaming.dlgGameDelete.on 'ok', () ->
    window.location.href = "/games"
  $('#game-delete').click () ->
    $.gaming.dlgGameDelete.open $(this).attr('data-game-id')
