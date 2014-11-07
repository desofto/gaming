module ModalHelper
  def modal( name, title, view, &block )
    @buttons = []
    content = capture( self, &block )
    render "/layouts/modal",
      name: name,
      title: title,
      view: view,
      content: content,
      buttons: @buttons
  end
  def button( name, options )
    @buttons.push( button_tag name, options )
  end
end
