classDialogGameEdit = ( dialog ) ->
  self = new $.moco.classDialog dialog

  self.init = ->
    self.editName = self.field '#game_name'
    self.editName.validate () ->
      $(this).value().length > 0

  self.open = ( id ) ->
    $(dialog).find('.modal-dialog .modal-content .modal-body').load "/games/modal?view=" + $(dialog).attr('view') + "&game=" + id, () ->
      self.init()
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
  $.gaming.dlgGameEdit = new classDialogGameEdit '#dlgGameEdit'
  $.gaming.dlgGameDelete2 = new classDialogGameDelete '#dlgGameDelete2'
  $.gaming.dlgGameEdit.on 'ok', () ->
    $('#game-name').value $.gaming.dlgGameEdit.editName.value()
  $.gaming.dlgGameDelete2.on 'ok', () ->
    window.location.href = "/games"
  $('#game-edit').click () ->
    $.gaming.dlgGameEdit.open $(this).attr('data-game-id')
  $('#game-delete').click () ->
    $.gaming.dlgGameDelete2.open $(this).attr('data-game-id')
