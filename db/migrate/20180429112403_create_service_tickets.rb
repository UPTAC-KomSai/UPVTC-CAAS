class CreateServiceTickets < ActiveRecord::Migration[5.1]
  def change
    create_table :service_tickets do |t|
      t.string :ticket

      t.timestamps
    end
  end
end
