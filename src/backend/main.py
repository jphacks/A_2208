from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import firebase_admin
from fb_setting import get_current_user


from db import crud, database, models, schemas
from db.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

load_dotenv()
default_app = firebase_admin.initialize_app()

origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/sample")
async def id(user_data=Depends(get_current_user)):
    uid = user_data["uid"]
    print(uid)
    return [uid]

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{uid}", response_model=schemas.User)
def read_user(uid: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, uid=uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/{uid}/repositorys/", response_model=schemas.Repository)
def create_item_for_user(
    uid: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_user_repository(db=db, item=item, uid=uid)

@app.get("/repositorys/", response_model=List[schemas.Repository])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repositorys = crud.get_repositorys(db, skip=skip, limit=limit)
    return repositorys