module ModalHelper
  include ActionView::Helpers::UrlHelper

  def modal( name, title, view, &block )
    @buttons = []

    opts = { class: "modal hide fade", id: name, view: view }

    if title.is_a?(Array) && title.size == 2
      opts['title-create'] = title[0]
      opts['title-edit'] = title[1]
      title = title[0]
    end

    content_tag :div, opts do
      content_tag :div, class: "modal-dialog" do
        content_tag :div, class: "modal-content" do
          (
            content_tag :div, class: "modal-header" do
              (
                button_tag type: "button", class: "close", 'data-dismiss' => "modal" do
                  content_tag :span, 'aria-hidden' => true do
                    "&times;".html_safe
                  end
                end
              ) + (
                content_tag :h4, class: "modal-title" do
                  title
                end
              )
            end
          ) + (
            content_tag :div, class: "modal-body" do
              capture( self, &block )
            end
          ) + (
            content_tag :div, class: "modal-footer" do
              @buttons.join.html_safe
            end
          )
        end
      end
    end
  end
  def button( name, options )
    @buttons.push( button_tag name, options )
  end
end
