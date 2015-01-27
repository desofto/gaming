require 'spec_helper'

describe Game do
  before do
    @game = Game.create( name: "Example Game" )
  end

  subject { @game }

  it { should respond_to(:name) }
  it { should respond_to(:status) }
  it { should respond_to(:rounds) }
  it { should respond_to(:badges) }
  it { expect(Game.count).to eq 1 }
end
