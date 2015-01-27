require 'spec_helper'

describe Round do
  before do
    @game = Game.create( name: "Example Game" )
    @round = Round.create( game: @game, name: "Example Round" )
    @round2 = Round.create( game: @game, name: "Another Example Round" )
  end

  subject { @round }

  it { should respond_to(:name) }
  it { should respond_to(:status) }
  it { expect(Round.count).to eq 2 }

  it "only single round should be active" do
  	@round.status = Round::ACTIVE
    @round.save
  	@round2.status = Round::ACTIVE
    @round2.save
  	expect(@round.reload.status).to eq Round::CLOSED
  	expect(@round2.reload.status).to eq Round::ACTIVE
  end
end
