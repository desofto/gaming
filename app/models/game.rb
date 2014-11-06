class Game < ActiveRecord::Base
  ACTIVE = 'active'
  DELETED = 'deleted'
  has_many :rounds, dependent: :destroy
  def Game.new( *args, &block )
    game = super
    game.status = Game::ACTIVE
    return game
  end
  def status
    status = super
    if !status then status = Game::ACTIVE end
  end
  def status_title
    case status
    when Game::ACTIVE
      "Активная"
    when Game::DELETED
      "Удалена"
    else
      "Активная"
    end
  end
end
