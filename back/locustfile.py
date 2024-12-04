from locust import HttpUser, task, between

class ChatApiUser(HttpUser):
    wait_time = between(1, 3)  # Simulate users waiting between 1 and 3 seconds between requests

    @task
    def test_root_endpoint(self):
        # Sending a GET request to the root endpoint
        response = self.client.get("/")
        
        # Asserting the response is correct
        if response.status_code == 200:
            expected_response = {"message": "Chat API is running"}
            assert response.json() == expected_response, f"Unexpected response: {response.json()}"
        else:
            print(f"Failed request: {response.status_code} {response.text}")
