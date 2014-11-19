module NavtabHelper
  include ActionView::Helpers::UrlHelper

  def navtab( name, &block )
    @tabs = []
    yield( self )
    (
      content_tag :ul, class: "nav nav-tabs", role: "tablist", id: name do
        @tabs.map do |tab|
          opts = { role: "presentation" }
          opts[:class] = 'active' if tab[:options][:active]
          content_tag :li, opts do
            link_to tab[:caption], "#" + tab[:name], role: "tab", 'data-toggle' => "tab"
          end
        end.join.html_safe
      end
    ) + (
      content_tag :div, class: "tab-content" do
        @tabs.map do |tab|
          content_tag :div, role: "tabpanel", class: "tab-pane fade" + ( tab[:options][:active] ? " in active" : "" ), id: tab[:name]  do
            tab[:content]
          end
        end.join.html_safe
      end
    )
  end
  
  def tab( name, caption, options = {}, &block )
    @tabs.push( {
      name: name,
      caption: caption,
      options: options,
      content: capture( &block )
    } )
  end
end
