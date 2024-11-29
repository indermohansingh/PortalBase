import random
import json
from faker import Faker

faker = Faker()

def generate_random_address():
    return {
        "type": random.choice(["home", "work", "other"]),
        "address": {
            "street": faker.street_address(),
            "city": faker.city(),
            "state": faker.state_abbr(),
            "zipcode": faker.zipcode()
        },
        "coordinates": {
            "latitude": round(random.uniform(-90, 90), 6),
            "longitude": round(random.uniform(-180, 180), 6)
        }
    }

def generate_random_order():
    num_items = random.randint(1, 5)
    items = [
        {
            "product_id": f"P{random.randint(1, 100):03d}",
            "quantity": random.randint(1, 10),
            "price": round(random.uniform(10, 500), 2)
        }
        for _ in range(num_items)
    ]
    return {
        "order_id": f"ORD{random.randint(100, 999)}",
        "date": faker.date_this_year().isoformat(),
        "total": round(sum(item["quantity"] * item["price"] for item in items), 2),
        "items": items
    }

def generate_random_user(user_id):
    num_addresses = random.randint(1, 3)
    num_orders = random.randint(1, 4)
    return {
        "id": user_id,
        "name": faker.name(),
        "email": faker.email(),
        "addresses": [generate_random_address() for _ in range(num_addresses)],
        "orders": [generate_random_order() for _ in range(num_orders)],
        "preferences": {
            "notifications": random.choice([True, False]),
            "language": random.choice(["en", "es", "fr", "de"]),
            "categories": random.sample(
                ["electronics", "books", "fashion", "home", "sports", "music"], 
                random.randint(1, 3)
            )
        }
    }

# Generate 100 random users
data = [generate_random_user(user_id) for user_id in range(1, 101)]

# Save to a JSON file
with open("complex_data.json", "w") as f:
    json.dump(data, f, indent=2)

print("Data saved to 'complex_data.json'")
