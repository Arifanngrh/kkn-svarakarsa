from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    username: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class DesaIn(BaseModel):
    nama: str
    kecamatan: str = ""
    kabupaten: str = ""
    provinsi: str = ""
    deskripsi: str = ""
    visi: str = ""
    misi: str = ""
    alamat: str = ""
    maps_url: str = ""

class AnggotaIn(BaseModel):
    nama: str
    nim: str = ""
    jurusan: str = ""
    jabatan: str = "Anggota"
    foto: str = ""

class ProgramIn(BaseModel):
    nama: str
    kategori: str = ""
    deskripsi: str = ""
    status: str = "Rencana"
    tanggal: str = ""

class KegiatanIn(BaseModel):
    judul: str
    deskripsi: str = ""
    tanggal: str = ""
    lokasi: str = ""
    foto: str = ""

class BeritaIn(BaseModel):
    judul: str
    ringkasan: str = ""
    isi: str = ""
    tanggal: str = ""
    penulis: str = "Admin"
    published: bool = True

class GaleriIn(BaseModel):
    judul: str
    deskripsi: str = ""
    foto: str = ""

class KontakIn(BaseModel):
    nama: str
    email: EmailStr
    pesan: str
