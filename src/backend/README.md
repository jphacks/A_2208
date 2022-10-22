## backendをlocalで起動
### Python環境を準備
```
$ cd src/backend
$ python -m venv .venv

# 環境ごとに読み替え 参考は↓
# https://www.python.jp/install/windows/venv.html
$ .\venv\Scripts\Activate.ps1 

$ python -m pip install -r requirements.txt
```

### .env, account_key.json 等を配置
discordで共有

### 起動
```
uvicorn main:app --reload
```