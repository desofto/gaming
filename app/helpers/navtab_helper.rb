module NavtabHelper
  include ActionView::Helpers::UrlHelper

  def navtab( name, &block )
    @tabs = []
    yield( self )
    res = []
    item = content_tag :ul, class: "nav nav-tabs", role: "tablist", id: name do
      result = []
      for tab in @tabs
        opts = { role: "presentation" }
        opts[:class] = 'active' if tab[:options][:active]
        item = content_tag :li, opts do
          content_tag :a, href: "#" + tab[:name], role: "tab", 'data-toggle' => "tab" do
            tab[:caption]
          end
        end
        result.push item
      end
      result.join.html_safe
    end
    res.push item
    item = content_tag :div, class: "tab-content" do
      result = []
      for tab in @tabs
        item = content_tag :div, role: "tabpanel", class: "tab-pane fade" + ( tab[:options][:active] ? " in active" : "" ), id: tab[:name]  do
          tab[:content]
        end
        result.push item
      end
      result.join.html_safe
    end
    res.push item
    res.join.html_safe
  end
  
  def tab( name, caption, options = {}, &block )
    @tabs.push( {
      :name => name,
      caption: caption,
      options: options,
      content: capture( &block )
    } )
  end
end
