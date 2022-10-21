from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(uid=user.uid, user_name=user.user_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_repositorys(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Repository).offset(skip).limit(limit).all()


def create_user_repository(db: Session, repository: schemas.RepositoryCreate, user_id: int):
    db_repository = models.Item(**repository.dict(), owner_id=user_id)
    db.add(db_repository)
    db.commit()
    db.refresh(db_repository)
    return db_repository