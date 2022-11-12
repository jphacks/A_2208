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

def make_new_recipe_file(recipename, mddata):
    recipe_repo_list = get_recipe_repo_list()

    if "CookinGit-recipe-"+recipename in recipe_repo_list:
        update_recipe_file(recipename, mddata)
        
    commit_message = "first commit"

    github_user_name = get_user_data()
    repo = "CookinGit-recipe-"+recipename
    path = repo+".md"

    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
    }

    contents_data = mddata

    data = '{"message":"'+commit_message+'","content":"'+contents_data+'"}'


    response = requests.put('https://api.github.com/repos/'+github_user_name+'/'+repo+'/contents/'+path, headers=headers, data=data)
    print("Status Code", response.status_code)

def update_recipe_file(owner, recipename, mddata):
    recipe_repo_detail_json = recipe_repo_detail(owner, recipename)
    recipe_repo_sha = recipe_repo_detail_json['sha']

    repo = "CookinGit-recipe-"+recipename
    path = repo+".md"

    headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
    'Content-Type': 'application/x-www-form-urlencoded',
    }

    contents_data = mddata
    data = '{"message":"update commit","content":"'+contents_data+'","sha":"'+recipe_repo_sha+'"}'

    response = requests.put('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path, headers=headers, data=data)



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

    return recipe_repo_list





def recipe_repo_detail(owner, recipename):
    # リポジトリからファイルを取得
    headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': 'Bearer '+GITHUB_OAUTH_TOKEN,
    }

    
    repo = "CookinGit-recipe-"+recipename
    path = repo+".md"

    response = requests.get('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path, headers=headers)

    recipe_repo_detail_json = response.json()

    # print(response.json()['sha'])
    # print(response.json()['content'])

    return recipe_repo_detail_json



# make_new_recipe_file("test1", "bXkgbmV3IGZpbGUgY29udGVudHM=")
# recipe_repo_detail("kake-r", "test1")
# update_recipe_file("kake-r", "test1", "bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnRz")