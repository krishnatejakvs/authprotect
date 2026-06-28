from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership

def test_create_user(db_session):
    user = User(name="Test User", email="test@example.com", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    db_user = db_session.query(User).filter_by(email="test@example.com").first()
    assert db_user is not None
    assert db_user.name == "Test User"

def test_create_organization_and_membership(db_session):
    user = User(name="Admin User", email="admin@example.com", hashed_password="hashed")
    org = Organization(name="Test Org")
    
    db_session.add(user)
    db_session.add(org)
    db_session.commit()

    membership = Membership(user_id=user.id, organization_id=org.id, role="admin")
    db_session.add(membership)
    db_session.commit()

    db_membership = db_session.query(Membership).filter_by(user_id=user.id).first()
    assert db_membership is not None
    assert db_membership.role == "admin"
    assert db_membership.organization.name == "Test Org"
