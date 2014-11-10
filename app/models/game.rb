class Game < ActiveRecord::Base
  ACTIVE = 'active'
  DELETED = 'deleted'
  has_many :rounds, dependent: :destroy
  def Game.new( *args, &block )
    game = super
    game.status = Game::ACTIVE
    return game
  end
  def status2
    self.status = super
    if !self.status then self.status = Game::ACTIVE end
    self.status
  end
  def status_title
    case self.status
    when Game::ACTIVE
      "Active"
    when Game::DELETED
      "Deleted"
    else
      "Active"
    end
  end
  def destroy
    case self.status
    when Game::ACTIVE
      self.status = Game::DELETED
    when Game::DELETED
      self.status = Game::ACTIVE
    end
    save!
  end
end
