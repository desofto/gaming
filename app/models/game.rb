class Game < ActiveRecord::Base
  has_many :rounds, dependent: :destroy

  ACTIVE = 'active'
  DELETED = 'deleted'

  def Game.new( *args, &block )
    game = super
    game.status = Game::ACTIVE
    return game
  end

  def status
    status = super
    status = Game::ACTIVE unless status
    status
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
