class RoundsController < ApplicationController
  def update
    round = Round.find( params[:id] )
    round.update_attributes( params.require( :round ).permit( :game_id, :name, :status ) )
    render text: "OK"
  end

  def create
    @round = Round.new( params.require( :round ).permit( :game_id, :name, :status ) )
    if @round.save
      render text: "OK"
    else
      render text: "Error"
    end
  end

  def destroy
    round = Round.find( params[:round][:id] )
    round.destroy if round
    render text: "OK"
  end
end
