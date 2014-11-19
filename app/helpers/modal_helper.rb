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
          res = []
          item = content_tag :div, class: "modal-header" do
            res2 = []
            item = content_tag :button, type: "button", class: "close", 'data-dismiss' => "modal" do
              content_tag :span, 'aria-hidden' => true do
                "&times;".html_safe
              end
            end
            res2.push item

            item = content_tag :h4, class: "modal-title" do
              title
            end
            res2.push item

            res2.join.html_safe
          end
          res.push item

          item = content_tag :div, class: "modal-body" do
            capture( self, &block )
          end
          res.push item

          item = content_tag :div, class: "modal-footer" do
            @buttons.join.html_safe
          end
          res.push item

          res.join.html_safe
        end
      end
    end
  end
  def button( name, options )
    @buttons.push( button_tag name, options )
  end
end
