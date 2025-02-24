import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import json

# RSS feed URL for the podcast
rss_url = 'https://orvisffguide.libsyn.com/rss'

# Fetch the RSS feed
response = requests.get(rss_url)
if response.status_code != 200:
    raise Exception(f"Failed to fetch RSS feed: {response.status_code}")

# Parse the XML content
root = ET.fromstring(response.content)

# Extract the latest 50 episodes
items = root.findall('.//item')[:50]

episodes = []
for item in items:
    title = item.find('title').text
    pub_date = item.find('pubDate').text
    link = item.find('link').text
    description = item.find('description').text

    # Parse the HTML description to find the Fly Box questions
    soup = BeautifulSoup(description, 'html.parser')
    fly_box = soup.find(string=lambda text: text and 'fly box' in text.lower())
    questions = []
    if fly_box:
        # Look for a list (e.g., <ul> or <ol>) following the Fly Box marker
        list_element = fly_box.find_next(['ul', 'ol'])
        if list_element:
            questions = [li.text.strip() for li in list_element.find_all('li')]
        else:
            # Fallback: extract text after "Fly Box" if no list is found
            questions_text = fly_box.find_parent().find_next_sibling().text.strip() if fly_box.find_parent().find_next_sibling() else ""
            questions = [questions_text] if questions_text else []

    episodes.append({
        'title': title,
        'date': pub_date,
        'url': link,
        'questions': questions
    })

# Save the data to a JSON file
with open('episodes.json', 'w') as f:
    json.dump(episodes, f, indent=2)

print("Successfully saved the latest 50 episodes to episodes.json")