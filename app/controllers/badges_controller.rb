class BadgesController < ApplicationController
  def update
    badge = Badge.find( params[:id] )
    badge.update_attributes( params.require( :badge ).permit( :game_id, :name, :description, :img_url ) )
    process_upload( badge )
    badge.save!
    render text: "OK"
  end

  def create
    @badge = Badge.new( params.require( :badge ).permit( :game_id, :name, :description, :img_url ) )
    process_upload( @badge )
    if @badge.save
      render text: "OK"
    else
      render text: "Error"
    end
  end

  def destroy
    badge = Badge.find( params[:badge][:id] )
    badge.destroy if badge
    render text: "OK"
  end

  private
    def process_upload( badge )
      img_upload = params[:badge][:img_upload]
      return unless img_upload

      relativePath = File.join( "data", "game", badge.game_id.to_s, img_upload.original_filename )
      path = File.join( Rails.root.to_s, "public", relativePath )
      FileUtils.mkdir_p( File.dirname(path) ) unless File.exist?( File.dirname(path) )

      File.open( path, "wb" ) { |f| f.write( img_upload.read ) }

      badge.img_url = "/" + relativePath.gsub( "\\", "/" )
    end
end
