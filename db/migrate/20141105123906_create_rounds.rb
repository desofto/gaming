class CreateRounds < ActiveRecord::Migration
  def change
    create_table :rounds do |t|
      t.integer :game_id
      t.string :name
      t.string :status

      t.timestamps
    end
    add_index :rounds, [ :game_id ]
  end
end
