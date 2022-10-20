from fastapi import FastAPI, Depends
from dotenv import load_dotenv
import firebase_admin
from fb_setting import get_current_user

app = FastAPI()

load_dotenv()
default_app = firebase_admin.initialize_app()




@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/sample")
async def id(user_data=Depends(get_current_user)):
    uid = user_data["uid"]
    print(uid)
    return [uid]