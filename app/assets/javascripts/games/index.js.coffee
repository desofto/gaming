classDialogGameEdit = ( dialog ) ->
  self = new $.moco.classDialog dialog

  self.init = ->
    self.parent.init()
    self.editName = self.field '#game_name'
    self.editName.validate () ->
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
  if $('#dlgGameEdit').length > 0
    $.gaming.dlgGameEdit = new classDialogGameEdit '#dlgGameEdit'
    $.gaming.dlgGameEdit.on 'ok', () ->
      $('#game-name').value $.gaming.dlgGameEdit.editName.value()
    $('#game-edit').click () ->
      $.gaming.dlgGameEdit.open $(this).attr('data-game-id')

  if $('#dlgGameDelete').length > 0
    $.gaming.dlgGameDelete = new classDialogGameDelete '#dlgGameDelete'
    $.gaming.dlgGameDelete.on 'ok', () ->
      window.location.href = "/games"
    $('#game-delete').click () ->
      $.gaming.dlgGameDelete.open $(this).attr('data-game-id')
