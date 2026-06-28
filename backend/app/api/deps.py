from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import Optional

from app.core.database import get_db
from app.core.security import oauth2_scheme, SECRET_KEY, ALGORITHM
from app.models.user import User
from app.models.membership import Membership

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_with_role(
    required_roles: list[str] = None
):
    def role_checker(
        x_organization_id: str = Header(..., description="Organization ID"),
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        membership = db.query(Membership).filter(
            Membership.user_id == current_user.id,
            Membership.organization_id == x_organization_id
        ).first()

        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not a member of this organization"
            )
            
        if required_roles and membership.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
            
        return current_user, membership

    return role_checker
