from typing import List
from fastapi import FastAPI, Depends, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
#from sqlalchemy.orm import Session
from pydantic import BaseModel
import firebase_admin
import os
from fb_setting import get_current_user
from github import (
    get_user_data,
    get_recipe_repo_list,
    get_recipe_repo_detail,
    make_repo,
    make_new_recipe_file,
    update_recipe_file,
    aaa,
)

# from db import crud, database, models, schemas
# from db.database import SessionLocal, engine

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

load_dotenv()
default_app = firebase_admin.initialize_app()

origins = [
    "http://localhost:3000",
    "http://localhost",
    "https://jphacks.github.io/A_2208/",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoDetailItem(BaseModel):
    owner: str
    recipename: str 

class MakeItem(BaseModel):
    recipename: str 
    mddata: str

class UpdateItem(BaseModel):
    owner: str
    recipename: str 
    mddata: str


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/sample", )
async def id(user_data=Depends(get_current_user)):
    uid = user_data["uid"]
    print(uid)
    return [uid]

@app.get("/get_user_name")
async def root(req: Request):
    GITHUB_OAUTH_TOKEN = req.headers['x_github']
    github_login_name = get_user_data()
    return {"github_login_name": github_login_name}

@app.get("/get_recipe_repo_list")
async def root(req: Request):
    GITHUB_OAUTH_TOKEN = req.headers['x_github']
    recipe_repo_list = get_recipe_repo_list()
    return {"recipe_repo_list": recipe_repo_list}  

@app.post("/post_new_recipe_repo")
async def root(req: Request, item: MakeItem):
    GITHUB_OAUTH_TOKEN = req.headers['x_github']
    item_dict = item.dict()
    recipename = item_dict.recipename
    mddata = mddata.recipename
    status_code = make_new_recipe_file(recipename, mddata)
 
    return {"status_code":status_code} 





# @app.post("/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     crud.create_user(db=db, user=user)

# @app.get("/users/", response_model=List[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users

# @app.get("/users/{uid}", response_model=schemas.User)
# def read_user(uid: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, uid=uid)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user

# @app.post("/users/{uid}/repositorys/", response_model=schemas.Repository)
# def create_item_for_user(
#     uid: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
# ):
#     return crud.create_user_repository(db=db, item=item, uid=uid)

# @app.get("/repositorys/", response_model=List[schemas.Repository])
# def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     repositorys = crud.get_repositorys(db, skip=skip, limit=limit)
#     return repositorys