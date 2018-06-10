class CreateAuthenticatedApp < ActiveRecord::Migration[5.1]
  def change
    create_table :authenticated_app do |t|
      t.references :user, foreign_key: true
      t.string :client_url

      t.timestamps
    end
  end
end
