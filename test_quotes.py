import requests
api_url = 'http://api.quotable.io/quotes/random'
response = requests.get(api_url)
if response.status_code == requests.codes.ok:
    print(response.text)
else:
    print("Error:", response.status_code, response.text)