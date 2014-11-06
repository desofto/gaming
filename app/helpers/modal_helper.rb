module ModalHelper
  def modal( name, title, &block )
    @buttons = []
    content = block.call( self )
    render "/layouts/modal", name: name, title: title, content: content, buttons: @buttons
  end
  def button( name, options )
    @buttons.push( button_tag name, options )
  end
end
