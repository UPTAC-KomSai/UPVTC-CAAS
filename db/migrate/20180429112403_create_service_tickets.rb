class CreateServiceTickets < ActiveRecord::Migration[5.1]
  def change
    create_table :service_tickets do |t|
      t.string :uid, unique: true
      t.string :ticket, unique: true

      t.timestamps
    end
  end
end
