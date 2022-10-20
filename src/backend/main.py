from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
from fb_setting import get_current_user

app = FastAPI()

load_dotenv()
default_app = firebase_admin.initialize_app()

origins = [
    "http://localhost:3000",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_creditionals=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/sample")
async def id(user_data=Depends(get_current_user)):
    uid = user_data["uid"]
    print(uid)
    return [uid]