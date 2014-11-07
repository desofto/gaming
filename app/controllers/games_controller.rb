class GamesController < ApplicationController
  def show
    @game = Game.find( params[:id] )
    render "index"
  end
  
  def update
    game = Game.find( params[:id] )
    game.update_attributes( params.require( :game ).permit( :name ) )
    render text: "OK"
  end

  def index
    case params[:filter]
    when 'active'
      items = Game.where( :status => Game::ACTIVE )
    when 'deleted'
      items = Game.where( :status => Game::DELETED )
    else
      items = Game
    end
    @games_grid = initialize_grid(
      items,
      per_page: params[:count] || 10,
      name: 'frmGames',
      conditions: [ "name like ?", "%" + ( params[:name] || "" ) + "%" ]
    )
    if params[:ajax] == 'frmGames'
      render "games/_games_grid", layout: false
    else
      render "search"
    end
  end

  def modal
    view = params[:view].sub( "/", "/_" )
    render "games/modal/" + view, layout: false
  end

  def create
    user_params = params.require( :game ).permit( :name )
    @game = Game.new( user_params )
    if @game.save
      render text: "OK"
    else
      render text: "Error"
    end
  end

  def destroy
    game = Game.find( params[:game][:id] )
    game.destroy if game
    render text: "OK"
  end
end
