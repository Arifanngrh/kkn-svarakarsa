import os
import shutil
import uuid
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import Base, engine, get_db
from .models import User, Desa, Anggota, ProgramKerja, Kegiatan, Berita, Galeri, Kontak
from .schemas import *
from .auth import hash_password, verify_password, create_token, current_admin

Base.metadata.create_all(bind=engine)

BASE_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads")))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "5"))
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

app = FastAPI(title="KKN Svarakarsa API", version="2.0.0")
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def _delete_local_upload(url: str | None):
    if not url or not url.startswith("/uploads/"):
        return
    target = UPLOAD_DIR / Path(url).name
    if target.exists() and target.is_file():
        target.unlink(missing_ok=True)


def seed(db: Session):
    if not db.query(User).first():
        username = os.getenv("ADMIN_USERNAME", "admin")
        password = os.getenv("ADMIN_PASSWORD", "admin123")
        db.add(User(username=username, password_hash=hash_password(password), role="admin"))
    if not db.query(Desa).first():
        db.add(
            Desa(
                nama="Desa Cipelang",
                kecamatan="",
                kabupaten="",
                provinsi="Jawa Barat",
                deskripsi="Website informasi dan dokumentasi KKN Svarakarsa bersama masyarakat Desa Cipelang.",
                visi="Mewujudkan desa yang maju, mandiri, dan berdaya.",
                misi="Mendorong pemberdayaan masyarakat, digitalisasi, dan kolaborasi.",
            )
        )
    db.commit()


@app.on_event("startup")
def startup():
    db = next(get_db())
    try:
        seed(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "KKN Svarakarsa API aktif", "version": app.version}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.post("/api/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    return {"access_token": create_token(user), "token_type": "bearer", "username": user.username}


@app.get("/api/auth/me")
def me(user: User = Depends(current_admin)):
    return {"id": user.id, "username": user.username, "role": user.role}


@app.put("/api/auth/password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(current_admin),
):
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password baru minimal 8 karakter")
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Password lama salah")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Password berhasil diperbarui"}


def crud_router(model, schema, path):
    @app.get(f"/api/{path}")
    def list_items(db: Session = Depends(get_db)):
        return db.query(model).order_by(model.id.desc()).all()

    @app.post(f"/api/{path}")
    def create_item(data: schema, db: Session = Depends(get_db), _: User = Depends(current_admin)):
        obj = model(**data.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @app.put(f"/api/{path}/{{item_id}}")
    def update_item(item_id: int, data: schema, db: Session = Depends(get_db), _: User = Depends(current_admin)):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        old_photo = getattr(obj, "foto", None)
        new_data = data.model_dump()
        for key, value in new_data.items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
        if old_photo and "foto" in new_data and old_photo != new_data["foto"]:
            _delete_local_upload(old_photo)
        return obj

    @app.delete(f"/api/{path}/{{item_id}}")
    def delete_item(item_id: int, db: Session = Depends(get_db), _: User = Depends(current_admin)):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        old_photo = getattr(obj, "foto", None)
        db.delete(obj)
        db.commit()
        _delete_local_upload(old_photo)
        return {"message": "Berhasil dihapus"}

crud_router(Anggota, AnggotaIn, "anggota")
crud_router(ProgramKerja, ProgramIn, "program")
crud_router(Kegiatan, KegiatanIn, "kegiatan")
crud_router(Berita, BeritaIn, "berita")
crud_router(Galeri, GaleriIn, "galeri")


@app.get("/api/desa")
def get_desa(db: Session = Depends(get_db)):
    return db.query(Desa).first()


@app.put("/api/desa")
def update_desa(data: DesaIn, db: Session = Depends(get_db), _: User = Depends(current_admin)):
    obj = db.query(Desa).first()
    if not obj:
        obj = Desa()
        db.add(obj)
    for key, value in data.model_dump().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@app.post("/api/kontak")
def create_contact(data: KontakIn, db: Session = Depends(get_db)):
    obj = Kontak(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return {"message": "Pesan berhasil dikirim", "id": obj.id}


@app.get("/api/kontak")
def contacts(db: Session = Depends(get_db), _: User = Depends(current_admin)):
    return db.query(Kontak).order_by(Kontak.id.desc()).all()


@app.delete("/api/kontak/{item_id}")
def delete_contact(item_id: int, db: Session = Depends(get_db), _: User = Depends(current_admin)):
    obj = db.get(Kontak, item_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Pesan tidak ditemukan")
    db.delete(obj)
    db.commit()
    return {"message": "Pesan dihapus"}


@app.post("/api/upload")
def upload(file: UploadFile = File(...), _: User = Depends(current_admin)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT or file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Format file harus JPG, PNG, atau WEBP")

    name = f"{uuid.uuid4().hex}{ext}"
    target = UPLOAD_DIR / name
    total = 0
    try:
        with target.open("wb") as out:
            while chunk := file.file.read(1024 * 1024):
                total += len(chunk)
                if total > MAX_UPLOAD_MB * 1024 * 1024:
                    raise HTTPException(status_code=413, detail=f"Ukuran file maksimal {MAX_UPLOAD_MB} MB")
                out.write(chunk)
    except Exception:
        target.unlink(missing_ok=True)
        raise
    finally:
        file.file.close()
    return {"url": f"/uploads/{name}"}


@app.get("/api/stats")
def stats(db: Session = Depends(get_db), _: User = Depends(current_admin)):
    return {
        "anggota": db.query(Anggota).count(),
        "program": db.query(ProgramKerja).count(),
        "kegiatan": db.query(Kegiatan).count(),
        "berita": db.query(Berita).count(),
        "galeri": db.query(Galeri).count(),
        "pesan": db.query(Kontak).count(),
    }
