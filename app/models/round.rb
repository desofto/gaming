class Round < ActiveRecord::Base
  belongs_to :game

  ACTIVE = 'active'
  CLOSED = 'closed'

  def Round.new( *args, &block )
    round = super
    round.status = Round::ACTIVE unless round.status
    return round
  end

  def status
    status = super
    status = Round::ACTIVE unless status
    status
  end

  def status=( status )
    if status == Round::ACTIVE then
      for round in self.game.rounds
        round.status = Round::CLOSED
        round.save!
      end
    end
    super
  end

  def status_title
    case self.status
    when Round::ACTIVE
      "Active"
    when Round::CLOSED
      "Closed"
    else
      "Active"
    end
  end
end
