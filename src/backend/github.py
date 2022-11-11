import requests
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_OAUTH_TOKEN = os.environ['GITHUB_OAUTH_TOKEN']


def get_user_data():
    headers = {
        'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
    }

    response = requests.get('https://api.github.com/user', headers=headers)

    #print(response.json())
    #github_user_name = response.json()['name']
    github_login_name = response.json()['login']

    

    return github_login_name
    


def make_repo(recipe_name):
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    data = '{"name":"CookinGit-recipe-'+recipe_name+'","description":"This is CookinGit test repo!","homepage":"https://github.com","private":false,"auto_init":true}'


    response = requests.post('https://api.github.com/user/repos', headers=headers, data=data)

def make_recipe_file(recipename, mddata):
    if "CookinGit-recipe-"+recipename in get_recipe_repo_list():
        commit_message = "first commit"
    else:
        commit_message = "update commit"

    github_user_name = get_user_data()
    repo = "CookinGit-recipe-"+recipename
    path = repo+".md"

    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    contents_data = mddata

    data = '{"message":"'+commit_message+'","content":"'+contents_data+contents_data+'"}'

    response = requests.put('https://api.github.com/repos/'+github_user_name+'/'+repo+'/contents/'+path, headers=headers, data=data)
    print("Status Code", response.status_code)




def get_recipe_repo_list():
    # 直近30件のリポジトリからレシピリポジトリをリストにして返す
    github_user_name = get_user_data()
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
    }
    print('https://api.github.com/users/'+github_user_name+'/repos')
    response = requests.get('https://api.github.com/users/'+github_user_name+'/repos', headers=headers)

    recipe_repo_list = []
    for i in range(len(response.json())):
        repo_name = response.json()[i]['name']
        if "CookinGit-recipe-" in repo_name:
            recipe_repo_list.append(repo_name)

    print(recipe_repo_list)
    return recipe_repo_list





def recipe_repo_detail():
    # リポジトリからファイルのリストを取得
    a = 1





make_recipe_file("test1", "bXkgbmV3IGZpbGUgY29udGVudHM=")