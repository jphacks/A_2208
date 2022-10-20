from typing import List, Union

from pydantic import BaseModel

class RepositoryBase(BaseModel):
    title: str
    description: Union[str, None] = None

class RepositoryCreate(RepositoryBase):
    pass



class Repository(RepositoryBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    uid: str

class UserCreate(UserBase):
    user_name: str

class User(UserBase):
    id: int
    repositorys: List[Repository] = []

    class Config:
        orm_mode = True