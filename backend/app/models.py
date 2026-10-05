from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Desa(Base):
    __tablename__ = "desa"
    id = Column(Integer, primary_key=True)
    nama = Column(String(150), nullable=False)
    kecamatan = Column(String(150), default="")
    kabupaten = Column(String(150), default="")
    provinsi = Column(String(150), default="")
    deskripsi = Column(Text, default="")
    visi = Column(Text, default="")
    misi = Column(Text, default="")
    alamat = Column(Text, default="")
    maps_url = Column(Text, default="")

class Anggota(Base):
    __tablename__ = "anggota"
    id = Column(Integer, primary_key=True)
    nama = Column(String(150), nullable=False)
    nim = Column(String(50), default="")
    jurusan = Column(String(150), default="")
    jabatan = Column(String(100), default="Anggota")
    foto = Column(String(255), default="")

class ProgramKerja(Base):
    __tablename__ = "program_kerja"
    id = Column(Integer, primary_key=True)
    nama = Column(String(180), nullable=False)
    kategori = Column(String(100), default="")
    deskripsi = Column(Text, default="")
    status = Column(String(50), default="Rencana")
    tanggal = Column(String(30), default="")

class Kegiatan(Base):
    __tablename__ = "kegiatan"
    id = Column(Integer, primary_key=True)
    judul = Column(String(180), nullable=False)
    deskripsi = Column(Text, default="")
    tanggal = Column(String(30), default="")
    lokasi = Column(String(180), default="")
    foto = Column(String(255), default="")

class Berita(Base):
    __tablename__ = "berita"
    id = Column(Integer, primary_key=True)
    judul = Column(String(200), nullable=False)
    ringkasan = Column(Text, default="")
    isi = Column(Text, default="")
    tanggal = Column(String(30), default="")
    penulis = Column(String(100), default="Admin")
    published = Column(Boolean, default=True)

class Galeri(Base):
    __tablename__ = "galeri"
    id = Column(Integer, primary_key=True)
    judul = Column(String(180), nullable=False)
    deskripsi = Column(Text, default="")
    foto = Column(String(255), default="")

class Kontak(Base):
    __tablename__ = "kontak"
    id = Column(Integer, primary_key=True)
    nama = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    pesan = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
