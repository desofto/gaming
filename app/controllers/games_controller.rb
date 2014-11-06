class GamesController < ApplicationController
  def index
    @action = "search"
    case params[:filter]
    when 'active'
      items = Game.where( :status => Game::ACTIVE )
    when 'deleted'
      items = Game.where( :status => Game::DELETED )
    else
      items = Game
    end
    per_page = params[:count]
    per_page = 10 unless per_page
    
    name = params[:name]
    name = '' unless name
    
    @games_grid = initialize_grid( items, per_page: per_page, name: 'frmGames', conditions: [ "name like ?", "%"+name+"%" ] )
    if params[:ajax] == 'frmGames'
      render 'games/_games_grid', layout: false
    end
  end
  
  def modal
    @game = Game.find( params[:game] )
    view = params[:view].sub( "/", "/_" )
    render "games/modal/" + view, layout: false
  end
  
  def create
    user_params = params.require( :game ).permit( :name )
    @game = Game.new( user_params )
    if @game.save
      render :text => "OK"
    else
      render :text => "Error"
    end
  end
  
  def destroy
    game = Game.find( params[:id] )
    game.destroy if game
    render :text => "OK"
  end
end
