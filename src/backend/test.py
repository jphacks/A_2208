import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()


URL = os.environ['URL']
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
TEMP_CODE = os.environ['TEMP_CODE']





''''
(参考)
https://docs.github.com/ja/developers/apps/building-oauth-apps/authorizing-oauth-apps
'''




# 一時コードの取得
'''
スコープの種類
https://docs.github.com/ja/developers/apps/building-oauth-apps/scopes-for-oauth-apps
'''
scope = "user%20repo%20workflow" 
print(scope)
#scope = "user"
get_tempcode_url = "https://github.com/login/oauth/authorize?client_id="+CLIENT_ID+"&scope="+scope+"`"

print(get_tempcode_url)


# 一時コードと合体する
code = "○○○○○○○○○○○○○○○○"


# OAuthアクセストークン取りに行くPOST
get_token_url = URL+"?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&code="+code
print(get_token_url)

headers = {"Accept": "application/json"}

response = requests.post(get_token_url, headers=headers)
 
print("Status Code", response.status_code)
print("JSON Response ", response.json())

