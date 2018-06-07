class CreateClientApps < ActiveRecord::Migration[5.1]
  def change
    create_table :client_apps do |t|
      t.string :url, unique: true
      t.string :name

      t.timestamps
    end
  end
end
