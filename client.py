import pusher
import time
import random

# Initialize Pusher client
pusher_client = pusher.Pusher(
    app_id="1787355",
    key="af314e57292c6a5efb2a",
    secret="a137f16bac66e5e035d7",
    cluster="ap3",
    ssl=True
)

# Retrieve the real data (replace with your own logic)
start_time = time.time()

def retrieve_data():
    # Your code to retrieve the data goes here
    # For example, you can fetch data from a database or an API
    score = random.randint(0, 100)  # Replace with your logic to get the score
    depth = round(random.uniform(0.1, 10.0), 2)
    depth_g = depth # Replace with your logic to get the depth
    pressure = random.randint(0, 100)  # Replace with your logic to get the pressure
    cycle = random.randint(60, 130)  # Replace with your logic to get the cycle
    elapsed_time = int(time.time() - start_time)
    return score, depth, pressure, cycle, elapsed_time, depth_g

while True:
    score, depth, pressure, cycle, elapsed_time, depth_g = retrieve_data()
    data = {
        'score': score,
        'depth': depth,
        'depth_g': depth_g,
        'pressure': pressure,
        'elapsed_time': elapsed_time,
        'cycle': cycle
    }
    pusher_client.trigger('my-channel', 'my-event', data)
    time.sleep(1)  # Delay for 0.4 second5