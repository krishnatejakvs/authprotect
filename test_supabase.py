from supabase import create_client
import inspect
from storage3 import StorageFileAPI
print(inspect.signature(StorageFileAPI.upload))
