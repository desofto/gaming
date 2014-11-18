class Badge < ActiveRecord::Base
  belongs_to :game

  def destroy
    self.img_url = ""
    super
  end
  
  def img_url=( url )
    if url != self.img_url && !self.img_url.nil? && !self.img_url.empty?
      path = File.join( Rails.root.to_s, "public", self.img_url )
      File.delete( path ) if File.exist?( path )
    end
    super
  end
end
