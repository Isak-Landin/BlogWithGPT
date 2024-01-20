# 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

import os
import requests
from openai import OpenAI
import json

# imported just to make sure that the token is stored in environment variables
import preparation

headers = {
    'Authorization': 'Bearer ' + os.getenv('token', ''),
    "Content-Type": "application/json",
}

data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "system", "content": "Say this is a test!"}],
    "temperature": 0.7
}
# making a test request via the tutorial on their page.
# response = requests.get('https://api.openai.com/v1/models', headers=headers, data=data)
# print(json.loads(response.content))
# print(response.status_code)

# Making an actual request to the chatbot.
response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, data=json.dumps(data))

print(json.loads(response.content))