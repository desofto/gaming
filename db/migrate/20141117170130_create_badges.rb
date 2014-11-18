class CreateBadges < ActiveRecord::Migration
  def change
    create_table :badges do |t|
      t.integer :game_id
      t.string :name
      t.string :description
      t.string :img_url

      t.timestamps
    end
    add_index :badges, [ :game_id ]
  end
end
