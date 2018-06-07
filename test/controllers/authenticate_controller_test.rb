require 'test_helper'

class AuthenticateControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get authenticate_index_url
    assert_response :success
  end

end
