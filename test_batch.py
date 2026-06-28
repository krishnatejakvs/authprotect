import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.database import SessionLocal
from app.models.project import Project
from app.models.organization import Organization
from app.models.site import Site
from app.models.batch import Batch, BatchStatus
from app.worker import generate_batch_identities_task

db = SessionLocal()
# get any project and site
org = db.query(Organization).first()
if not org:
    org = Organization(name="Test Org", encryption_key="test_encryption_key_123")
    db.add(org)
    db.commit()
    db.refresh(org)

project = db.query(Project).first()
if not project:
    project = Project(name="Test Project", organization_id=org.id)
    db.add(project)
    db.commit()
    db.refresh(project)

site = db.query(Site).first()
if not site:
    site = Site(name="Test Site", organization_id=org.id, location="Test Location")
    db.add(site)
    db.commit()
    db.refresh(site)

batch = Batch(
    name="Test Batch RS DCT",
    quantity=1,
    project_id=project.id,
    site_id=site.id,
    status=BatchStatus.PENDING
)
db.add(batch)
db.commit()
db.refresh(batch)

print(f"Triggering batch task for batch {batch.id}")
generate_batch_identities_task.delay(batch.id)

print("Task triggered.")
