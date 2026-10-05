import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  Users,
  Leaf,
  CalendarDays,
  Images,
  Newspaper,
  MapPin,
  LogOut,
  LayoutDashboard,
  Pencil,
  Trash2,
  Save,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  Home as HomeIcon,
  LockKeyhole,
  ExternalLink,
} from "lucide-react";
import { api, mediaUrl, uploadImage } from "./api";

const LOGO = "/svarakarsa-logo.png";

const navItems = [
  ["/", "Beranda"],
  ["/profil", "Profil Desa"],
  ["/program", "Program Kerja"],
  ["/kegiatan", "Kegiatan"],
  ["/galeri", "Galeri"],
  ["/anggota", "Anggota"],
  ["/berita", "Berita"],
  ["/kontak", "Kontak"],
];

const pageCopy = {
  program: "Program kerja yang dirancang untuk memberi manfaat nyata bagi masyarakat.",
  kegiatan: "Dokumentasi kegiatan KKN Svarakarsa bersama masyarakat Desa Cipelang.",
  galeri: "Kumpulan dokumentasi visual kegiatan, program, dan momen kebersamaan.",
  anggota: "Tim mahasiswa KKN Svarakarsa yang menjalankan program bersama masyarakat.",
  berita: "Informasi dan kabar terbaru seputar kegiatan KKN Svarakarsa.",
};

const RESOURCE_CONFIG = {
  anggota: {
    label: "Anggota",
    endpoint: "anggota",
    fields: [
      { key: "nama", label: "Nama", required: true },
      { key: "nim", label: "NIM" },
      { key: "jurusan", label: "Jurusan" },
      { key: "jabatan", label: "Jabatan" },
      { key: "foto", label: "Foto", type: "image" },
    ],
  },
  program: {
    label: "Program Kerja",
    endpoint: "program",
    fields: [
      { key: "nama", label: "Nama", required: true },
      { key: "kategori", label: "Kategori" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Rencana", "Berjalan", "Selesai"],
      },
      { key: "tanggal", label: "Tanggal", type: "date" },
      { key: "deskripsi", label: "Deskripsi", type: "textarea" },
    ],
  },
  kegiatan: {
    label: "Kegiatan",
    endpoint: "kegiatan",
    fields: [
      { key: "judul", label: "Judul", required: true },
      { key: "tanggal", label: "Tanggal", type: "date" },
      { key: "lokasi", label: "Lokasi" },
      { key: "deskripsi", label: "Deskripsi", type: "textarea" },
      { key: "foto", label: "Foto", type: "image" },
    ],
  },
  berita: {
    label: "Berita",
    endpoint: "berita",
    fields: [
      { key: "judul", label: "Judul", required: true },
      { key: "tanggal", label: "Tanggal", type: "date" },
      { key: "penulis", label: "Penulis" },
      { key: "ringkasan", label: "Ringkasan", type: "textarea" },
      { key: "isi", label: "Isi", type: "textarea" },
      { key: "published", label: "Publikasikan", type: "checkbox" },
    ],
  },
  galeri: {
    label: "Galeri",
    endpoint: "galeri",
    fields: [
      { key: "judul", label: "Judul", required: true },
      { key: "deskripsi", label: "Deskripsi", type: "textarea" },
      { key: "foto", label: "Foto", type: "image" },
    ],
  },
};

const EMPTY_VALUES = {
  nama: "",
  nim: "",
  jurusan: "",
  jabatan: "Anggota",
  foto: "",
  kategori: "",
  status: "Rencana",
  tanggal: "",
  deskripsi: "",
  judul: "",
  lokasi: "",
  ringkasan: "",
  isi: "",
  penulis: "Admin",
  published: true,
};

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function Brand({ compact = false, footer = false }) {
  return (
    <Link className={`brand ${compact ? "brand-compact" : ""}`} to="/" aria-label="KKN Svarakarsa">
      <img className={footer ? "brand-logo footer-logo" : "brand-logo"} src={LOGO} alt="Logo KKN Svarakarsa Desa Cipelang" />
      <span className="brand-word">SVARAKARSA<span>.</span></span>
    </Link>
  );
}

function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="header">
        <div className="container nav">
          <Brand />
          <button
            className="menu"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav className={open ? "open" : ""} aria-label="Navigasi utama">
            {navItems.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link className="admin-link" to="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer-wrap">
        <div className="container footer">
          <div>
            <Brand footer />
            <p>
              Kolaborasi mahasiswa dan masyarakat untuk desa yang lebih berdaya,
              informatif, dan berkelanjutan.
            </p>
          </div>
          <div>
            <b>MENU</b>
            <p>Profil · Program · Kegiatan · Galeri</p>
          </div>
          <div>
            <b>INFORMASI</b>
            <p>KKN Svarakarsa · Desa Cipelang</p>
          </div>
        </div>
        <div className="copyright">© 2026 KKN Svarakarsa. All rights reserved.</div>
      </footer>
    </div>
  );
}

function Home() {
  const [desa, setDesa] = useState(null);
  const [anggota, setAnggota] = useState([]);
  const [program, setProgram] = useState([]);
  const [programTotal, setProgramTotal] = useState(0);
  const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanTotal, setKegiatanTotal] = useState(0);
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api("/api/desa"),
      api("/api/anggota"),
      api("/api/program"),
      api("/api/kegiatan"),
      api("/api/berita"),
    ])
      .then(([d, a, p, k, b]) => {
        setDesa(d);
        setAnggota(a);
        setProgramTotal(p.length);
        setProgram(p.slice(0, 3));
        setKegiatanTotal(k.length);
        setKegiatan(k.slice(0, 3));
        setBerita(b.filter((item) => item.published !== false).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">KULIAH KERJA NYATA · SVARAKARSA</span>
            <h1>
              Bersama Membangun Desa, <em>Bersama Berkarya.</em>
            </h1>
            <p>
              {desa?.deskripsi ||
                "Platform informasi, program kerja, dan dokumentasi KKN Svarakarsa bersama masyarakat Desa Cipelang."}
            </p>
            <div className="actions">
              <Link className="btn" to="/program">
                Lihat Program <ArrowRight size={18} />
              </Link>
              <Link className="btn ghost" to="/profil">
                Tentang Desa
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <img className="hero-logo" src={LOGO} alt="Logo KKN Svarakarsa" />
            <small>SVARAKARSA · DESA CIPELANG</small>
            <b>Mahasiswa × Masyarakat</b>
            <p>Ide, aksi, dan dampak dalam satu ruang.</p>
          </div>
        </div>
      </section>

      <section className="container stats" aria-label="Statistik KKN">
        <Stat icon={<Users />} n={loading ? "—" : anggota.length} t="Anggota" to="/anggota" />
        <Stat icon={<Leaf />} n={loading ? "—" : programTotal} t="Program Kerja" to="/program" />
        <Stat icon={<CalendarDays />} n={loading ? "—" : kegiatanTotal} t="Kegiatan" to="/kegiatan" />
        <Stat icon={<Images />} n="∞" t="Dokumentasi" to="/galeri" />
      </section>

      <Section title="Program Unggulan" link="/program">
        {program.map((item) => (
          <Card key={item.id} title={item.nama} tag={item.status || item.kategori} text={item.deskripsi} />
        ))}
        {!loading && !program.length && <Empty />}
      </Section>

      <Section title="Kegiatan Terbaru" link="/kegiatan">
        {kegiatan.map((item) => (
          <Card
            key={item.id}
            title={item.judul}
            tag={formatDate(item.tanggal)}
            text={item.lokasi || item.deskripsi}
            image={item.foto}
          />
        ))}
        {!loading && !kegiatan.length && <Empty />}
      </Section>

      <Section title="Berita Terbaru" link="/berita">
        {berita.map((item) => (
          <Card key={item.id} title={item.judul} tag={formatDate(item.tanggal)} text={item.ringkasan} />
        ))}
        {!loading && !berita.length && <Empty />}
      </Section>
    </Layout>
  );
}

function Stat({ icon, n, t, to }) {
  return (
    <Link className="stat" to={to}>
      {icon}
      <b>{n}</b>
      <span>{t}</span>
    </Link>
  );
}

function Section({ title, link, children }) {
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <span className="section-kicker">SVARAKARSA</span>
          <h2>{title}</h2>
        </div>
        <Link to={link}>Lihat semua <ArrowRight size={15} /></Link>
      </div>
      <div className="grid3">{children}</div>
    </section>
  );
}

function Card({ title, tag, text, image }) {
  return (
    <article className="card">
      {image ? (
        <img className="card-image" src={mediaUrl(image)} alt="" loading="lazy" />
      ) : (
        <div className="card-image placeholder" aria-hidden="true">
          <img src={LOGO} alt="" />
        </div>
      )}
      <div className="card-body">
        {tag && <span>{tag}</span>}
        <h3>{title}</h3>
        <p>{text || "Informasi kegiatan KKN Svarakarsa."}</p>
      </div>
    </article>
  );
}

function ListPage({ type, title, icon }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/api/${type}`)
      .then((data) => setItems(type === "berita" ? data.filter((item) => item.published !== false) : data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [type]);

  const description = pageCopy[type] || "Informasi resmi KKN Svarakarsa.";

  return (
    <Layout>
      <PageHero icon={icon} title={title} description={description} />
      <section className="container section">
        {loading ? (
          <LoadingGrid />
        ) : (
          <>
            <div className="grid3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  title={item.judul || item.nama}
                  tag={item.tanggal ? formatDate(item.tanggal) : item.kategori || item.jabatan}
                  text={item.deskripsi || item.ringkasan || item.lokasi || item.jurusan}
                  image={item.foto}
                />
              ))}
            </div>
            {!items.length && <Empty />}
          </>
        )}
      </section>
    </Layout>
  );
}

function PageHero({ icon, title, description }) {
  return (
    <div className="pagehero">
      <div className="container">
        <div className="iconbox">{icon}</div>
        <h1>{title}</h1>
        <p>{description || "Informasi resmi KKN Svarakarsa."}</p>
      </div>
    </div>
  );
}

function Empty({ children = "Belum ada data untuk ditampilkan." }) {
  return <div className="empty">{children}</div>;
}

function LoadingGrid() {
  return (
    <div className="grid3">
      {[1, 2, 3].map((item) => (
        <div className="card skeleton-card" key={item}>
          <div className="skeleton skeleton-photo" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </div>
      ))}
    </div>
  );
}

function Profil() {
  const [desa, setDesa] = useState(null);

  useEffect(() => {
    api("/api/desa").then(setDesa).catch(() => setDesa(null));
  }, []);

  return (
    <Layout>
      <PageHero
        title="Profil Desa"
        icon={<MapPin />}
        description="Mengenal Desa Cipelang dan informasi lokasi KKN Svarakarsa."
      />
      <section className="container prose">
        <div className="profile-heading">
          <span className="section-kicker">PROFIL</span>
          <h2>{desa?.nama || "Desa Cipelang"}</h2>
          <p>{desa?.deskripsi || "Profil desa dapat diperbarui melalui dashboard admin."}</p>
        </div>

        <div className="location-chips">
          {[desa?.kecamatan, desa?.kabupaten, desa?.provinsi].filter(Boolean).map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>

        <div className="twocol">
          <div>
            <span className="section-kicker">VISI</span>
            <h3>Visi</h3>
            <p>{desa?.visi || "Belum diisi oleh admin."}</p>
          </div>
          <div>
            <span className="section-kicker">MISI</span>
            <h3>Misi</h3>
            <p>{desa?.misi || "Belum diisi oleh admin."}</p>
          </div>
        </div>

        <div className="profile-location">
          <div>
            <span className="section-kicker">LOKASI</span>
            <h3>Alamat</h3>
            <p>{desa?.alamat || "Belum diisi oleh admin."}</p>
          </div>
          {desa?.maps_url && (
            <a className="btn" href={desa.maps_url} target="_blank" rel="noreferrer">
              Buka Google Maps <ExternalLink size={16} />
            </a>
          )}
        </div>
      </section>
    </Layout>
  );
}

function Kontak() {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMsg("");
    setError("");
    setSending(true);
    try {
      await api("/api/kontak", { method: "POST", body: JSON.stringify(form) });
      setMsg("Pesan berhasil dikirim. Terima kasih sudah menghubungi kami.");
      setForm({ nama: "", email: "", pesan: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Layout>
      <PageHero title="Hubungi Kami" icon={<Mail />} description="Kirim pesan atau pertanyaan kepada tim KKN Svarakarsa." />
      <section className="container form-wrap">
        <div className="contact-card">
          <div className="contact-copy">
            <span className="section-kicker">KONTAK</span>
            <h2>Terhubung dengan tim KKN</h2>
            <p>Isi formulir berikut. Pesan akan masuk ke dashboard admin untuk ditindaklanjuti.</p>
          </div>
          <form onSubmit={submit}>
            <label className="field"><span>Nama</span><input placeholder="Nama lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></label>
            <label className="field"><span>Email</span><input type="email" placeholder="nama@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label className="field"><span>Pesan</span><textarea placeholder="Tulis pesan kamu..." value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} required /></label>
            <button className="btn" disabled={sending}>{sending ? "Mengirim..." : "Kirim Pesan"}</button>
            {msg && <p className="success">{msg}</p>}
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", result.access_token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form onSubmit={submit}>
        <div className="login-brand">
          <img className="login-logo" src={LOGO} alt="Logo KKN Svarakarsa" />
          <div>
            <span className="login-overline">KKN DESA CIPELANG</span>
            <span className="brand-word">SVARAKARSA<span>.</span></span>
          </div>
        </div>
        <div>
          <span className="section-kicker">AREA ADMIN</span>
          <h1>Masuk Dashboard</h1>
          <p className="login-note">Kelola seluruh konten website dari satu tempat.</p>
        </div>
        <label className="field"><span>Username</span><input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required /></label>
        <div className="password-wrap">
          <label className="field"><span>Password</span><input type={show ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></label>
          <button type="button" onClick={() => setShow((value) => !value)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>{show ? <EyeOff /> : <Eye />}</button>
        </div>
        <button className="btn" disabled={loading}>{loading ? "Memproses..." : "Masuk"}</button>
        {error && <p className="error">{error}</p>}
        <Link className="back-link" to="/"><HomeIcon size={15} /> Kembali ke website</Link>
      </form>
    </div>
  );
}

function ResourceEditor({ type, items, reload, notify }) {
  const config = RESOURCE_CONFIG[type];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_VALUES });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startEdit(item) {
    setEditing(item);
    setForm({ ...EMPTY_VALUES, ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditing(null);
    setForm({ ...EMPTY_VALUES });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api(editing ? `/api/${config.endpoint}/${editing.id}` : `/api/${config.endpoint}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      notify(editing ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
      reset();
      await reload();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Hapus data ini?")) return;
    try {
      await api(`/api/${config.endpoint}/${id}`, { method: "DELETE" });
      notify("Data berhasil dihapus");
      await reload();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function onImage(file, key) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setForm((current) => ({ ...current, [key]: result.url }));
      notify("Foto berhasil diunggah");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="resource-layout">
      <div className="admin-panel">
        <div className="panel-head">
          <div>
            <span className="section-kicker">FORM</span>
            <h2>{editing ? `Edit ${config.label}` : `Tambah ${config.label}`}</h2>
          </div>
          {editing && <button className="btn ghost small" type="button" onClick={reset}>Batal</button>}
        </div>
        <form className="admin-form" onSubmit={save}>
          {config.fields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={(value) => setForm({ ...form, [field.key]: value })}
              onFile={(file) => onImage(file, field.key)}
              uploading={uploading}
            />
          ))}
          <button className="btn" disabled={saving || uploading}>
            {saving ? "Menyimpan..." : <><Save size={17} /> Simpan</>}
          </button>
        </form>
      </div>

      <div className="admin-panel">
        <div className="panel-head">
          <div>
            <span className="section-kicker">DATA</span>
            <h2>Daftar {config.label}</h2>
          </div>
          <span className="count">{items.length} data</span>
        </div>
        <div className="table">
          {items.map((item) => (
            <div className="row" key={item.id}>
              <div>
                <b>{item.nama || item.judul}</b>
                <small>{item.tanggal ? formatDate(item.tanggal) : item.kategori || item.status || item.jabatan || item.lokasi || ""}</small>
              </div>
              <div className="row-actions">
                <button title="Edit" onClick={() => startEdit(item)}><Pencil size={16} /></button>
                <button className="danger" title="Hapus" onClick={() => remove(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {!items.length && <div className="empty">Belum ada data.</div>}
        </div>
      </div>
    </div>
  );
}

function Field({ field, value, onChange, onFile, uploading }) {
  if (field.type === "checkbox") {
    return (
      <label className="check">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="field">
        <span>{field.label}</span>
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} required={field.required} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="field">
        <span>{field.label}</span>
        <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <div className="field">
        <span>{field.label}</span>
        <div className="image-manager">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
          <div className="file-meta">JPG, PNG, WEBP · maksimal 5 MB.</div>
          {value && (
            <>
              <img className="image-preview" src={mediaUrl(value)} alt="Preview foto" />
              <div className="image-actions">
                <button type="button" className="btn ghost small" onClick={() => onChange("")}>Hapus Foto</button>
                <span className="file-meta">Pilih file baru untuk mengganti foto.</span>
              </div>
            </>
          )}
          {uploading && <small className="hint">Mengunggah foto...</small>}
        </div>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <label className="field">
        <span>{field.label}</span>
        <input type="date" value={value || ""} onChange={(event) => onChange(event.target.value)} required={field.required} />
        <small className="date-help">Klik kolom tanggal untuk memilih dari kalender.</small>
      </label>
    );
  }

  return (
    <label className="field">
      <span>{field.label}</span>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} required={field.required} />
    </label>
  );
}

function DesaManager({ notify }) {
  const empty = useMemo(() => ({
    nama: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    deskripsi: "",
    visi: "",
    misi: "",
    alamat: "",
    maps_url: "",
  }), []);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/desa")
      .then((value) => value && setForm(value))
      .catch((err) => notify(err.message, "error"));
  }, [notify]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api("/api/desa", { method: "PUT", body: JSON.stringify(form) });
      notify("Profil desa berhasil diperbarui");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const basicFields = [
    ["nama", "Nama Desa"],
    ["kecamatan", "Kecamatan"],
    ["kabupaten", "Kabupaten"],
    ["provinsi", "Provinsi"],
    ["alamat", "Alamat"],
    ["maps_url", "Google Maps URL"],
  ];

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <div>
          <span className="section-kicker">IDENTITAS DESA</span>
          <h2>Profil Desa</h2>
        </div>
      </div>
      <form className="admin-form" onSubmit={save}>
        <div className="form-grid-2">
          {basicFields.map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
        </div>
        <label className="field"><span>Deskripsi</span><textarea value={form.deskripsi || ""} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} /></label>
        <div className="twocol-form">
          <label className="field"><span>Visi</span><textarea value={form.visi || ""} onChange={(event) => setForm({ ...form, visi: event.target.value })} /></label>
          <label className="field"><span>Misi</span><textarea value={form.misi || ""} onChange={(event) => setForm({ ...form, misi: event.target.value })} /></label>
        </div>
        <button className="btn" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Profil"}</button>
      </form>
    </div>
  );
}

function ContactManager({ items, reload, notify }) {
  async function remove(id) {
    if (!window.confirm("Hapus pesan ini?")) return;
    try {
      await api(`/api/kontak/${id}`, { method: "DELETE" });
      notify("Pesan berhasil dihapus");
      await reload();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <div><span className="section-kicker">KONTAK</span><h2>Pesan Masuk</h2></div>
        <span className="count">{items.length} pesan</span>
      </div>
      <div className="messages">
        {items.map((item) => (
          <article className="message" key={item.id}>
            <div className="message-head">
              <div><b>{item.nama}</b><span>{item.email}</span></div>
              <button className="danger-text" onClick={() => remove(item.id)}>Hapus</button>
            </div>
            <p>{item.pesan}</p>
          </article>
        ))}
        {!items.length && <Empty>Belum ada pesan masuk.</Empty>}
      </div>
    </div>
  );
}

function Admin() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [data, setData] = useState({});
  const [notice, setNotice] = useState(null);
  const [pwd, setPwd] = useState({ current_password: "", new_password: "" });

  const sections = {
    overview: "Ringkasan",
    desa: "Profil Desa",
    anggota: "Anggota",
    program: "Program Kerja",
    kegiatan: "Kegiatan",
    berita: "Berita",
    galeri: "Galeri",
    pesan: "Pesan",
    security: "Keamanan",
  };

  const notify = useCallback((message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 2800);
  }, []);

  async function loadResource(type) {
    const result = await api(`/api/${type}`);
    setData((current) => ({ ...current, [type]: result }));
  }

  async function refreshStats() {
    const result = await api("/api/stats");
    setStats(result);
  }

  async function loadAll() {
    try {
      const [statsResult, userResult] = await Promise.all([api("/api/stats"), api("/api/auth/me")]);
      setStats(statsResult);
      setUser(userResult);
      const endpoints = [...Object.values(RESOURCE_CONFIG).map((item) => item.endpoint), "kontak"];
      await Promise.all(endpoints.map((endpoint) => loadResource(endpoint)));
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        notify(err.message, "error");
      }
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function changePassword(event) {
    event.preventDefault();
    try {
      await api("/api/auth/password", { method: "PUT", body: JSON.stringify(pwd) });
      setPwd({ current_password: "", new_password: "" });
      notify("Password berhasil diperbarui");
    } catch (err) {
      notify(err.message, "error");
    }
  }

  function iconFor(key) {
    const map = {
      overview: <LayoutDashboard size={16} />,
      desa: <MapPin size={16} />,
      anggota: <Users size={16} />,
      program: <Leaf size={16} />,
      kegiatan: <CalendarDays size={16} />,
      berita: <Newspaper size={16} />,
      galeri: <Images size={16} />,
      pesan: <Mail size={16} />,
      security: <LockKeyhole size={16} />,
    };
    return map[key];
  }

  let content;
  if (section === "overview") {
    content = <Overview stats={stats} />;
  } else if (section === "desa") {
    content = <DesaManager notify={notify} />;
  } else if (section === "pesan") {
    content = <ContactManager items={data.kontak || []} reload={() => loadResource("kontak")} notify={notify} />;
  } else if (section === "security") {
    content = (
      <div className="admin-panel security-panel">
        <div className="panel-head"><div><span className="section-kicker">KEAMANAN</span><h2>Ganti Password</h2></div></div>
        <form className="admin-form" onSubmit={changePassword}>
          <label className="field"><span>Password Lama</span><input type="password" value={pwd.current_password} onChange={(event) => setPwd({ ...pwd, current_password: event.target.value })} required /></label>
          <label className="field"><span>Password Baru</span><input type="password" minLength={8} value={pwd.new_password} onChange={(event) => setPwd({ ...pwd, new_password: event.target.value })} required /></label>
          <p className="hint">Gunakan minimal 8 karakter dan jangan gunakan password default untuk website production.</p>
          <button className="btn">Perbarui Password</button>
        </form>
      </div>
    );
  } else {
    content = (
      <ResourceEditor
        type={section}
        items={data[section] || []}
        reload={async () => {
          await loadResource(section);
          await refreshStats();
        }}
        notify={notify}
      />
    );
  }

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Brand compact />
        <div className="admin-user">
          <ShieldCheck size={17} />
          <div><b>{user?.username || "Admin"}</b><small>Administrator</small></div>
        </div>
        <h4>MANAGEMENT</h4>
        {Object.entries(sections).map(([key, label]) => (
          <button className={section === key ? "active" : ""} onClick={() => setSection(key)} key={key}>
            {iconFor(key)}<span>{label}</span>
          </button>
        ))}
        <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}><LogOut size={16} /><span>Logout</span></button>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="eyebrow">SVARAKARSA ADMIN</span>
            <h1>{sections[section]}</h1>
          </div>
          <Link className="admin-preview-link" to="/">Lihat Website <ExternalLink size={15} /></Link>
        </div>
        {notice && <div className={`toast ${notice.type}`} role="status" aria-live="polite">{notice.message}</div>}
        {content}
      </main>
    </div>
  );
}

function Overview({ stats }) {
  return (
    <>
      <div className="admin-stats">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key}><span>{key}</span><b>{value}</b></div>
        ))}
      </div>
      <div className="admin-panel welcome">
        <span className="section-kicker">DASHBOARD</span>
        <h2>Website KKN Svarakarsa</h2>
        <p>Kelola profil desa, anggota, program kerja, kegiatan, berita, galeri, dan pesan pengunjung dari dashboard ini.</p>
        <div className="quick"><Link to="/" className="btn ghost">Buka Website</Link></div>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <Layout>
      <section className="container not-found">
        <div className="iconbox"><HomeIcon /></div>
        <h1>Halaman tidak ditemukan</h1>
        <p>Halaman yang kamu cari tidak tersedia.</p>
        <Link className="btn" to="/">Kembali ke Beranda</Link>
      </section>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/program" element={<ListPage type="program" title="Program Kerja" icon={<Leaf />} />} />
      <Route path="/kegiatan" element={<ListPage type="kegiatan" title="Kegiatan KKN" icon={<CalendarDays />} />} />
      <Route path="/galeri" element={<ListPage type="galeri" title="Galeri Dokumentasi" icon={<Images />} />} />
      <Route path="/anggota" element={<ListPage type="anggota" title="Tim KKN" icon={<Users />} />} />
      <Route path="/berita" element={<ListPage type="berita" title="Berita & Informasi" icon={<Newspaper />} />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
