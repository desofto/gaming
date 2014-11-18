class GamesController < ApplicationController
  def show
    @game = Game.find( params[:id] )

    case params[:ajax]
    when 'gridGameRounds'
      @gridRounds = gridRounds( params[:filter], params[:count] )
      render "games/grid/index/_rounds", layout: false
    when 'gridGameBadges'
      @gridBadges = gridBadges()
      render "games/grid/index/_badges", layout: false
    else
      @gridRounds = gridRounds()
      @gridBadges = gridBadges()
      render "index"
    end
  end
  
  def update
    game = Game.find( params[:id] )
    game.update_attributes( params.require( :game ).permit( :name ) )
    render text: "OK"
  end

  def index
    case params[:filter]
    when 'active'
      games = Game.where( :status => Game::ACTIVE )
    when 'deleted'
      games = Game.where( :status => Game::DELETED )
    else
      games = Game
    end
    @gridGames = initialize_grid(
      games,
      per_page: params[:count] || 10,
      name: 'gridGames',
      conditions: [ "name like ?", "%" + ( params[:name] || "" ) + "%" ]
    )
    if params[:ajax] == 'gridGames'
      render "games/grid/_search", layout: false
    else
      render "search"
    end
  end

  def modal
    view = params[:view].sub( "/", "/_" )
    render "games/modal/" + view, layout: false
  end

  def create
    @game = Game.new( params.require( :game ).permit( :name ) )
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
  
  private
    def gridRounds( filter = 'all', count = 10 )
      case filter
      when 'active'
        rounds = @game.rounds.where( :status => Round::ACTIVE )
      when 'closed'
        rounds = @game.rounds.where( :status => Round::CLOSED )
      else
        rounds = @game.rounds
      end
      initialize_grid(
        rounds,
        per_page: count || 10,
        name: 'gridGameRounds'
      )
    end

    def gridBadges
      badges = @game.badges
      initialize_grid(
        badges,
        per_page: 10,
        name: 'gridGameBadges'
      )
    end
end
