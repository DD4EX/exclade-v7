import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Trash2, UserPlus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";

import { firebaseAuth, firebaseDb, getSecondaryAuth } from "@/integrations/firebase/client";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management | EXCLADE 2K26 Organiser" },
      { name: "description", content: "Private organiser user management for EXCLADE 2K26." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminUsersPage,
});

type AdminUser = { id: string; username: string; label: string | null; createdAt: string };

const salt = "exclade2k26";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(`${salt}${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(firebaseDb, "adminUsers"), orderBy("createdAt", "asc")));
      setUsers(snapshot.docs.map((item) => {
        const row = item.data();
        return { id: item.id, username: row.username, label: row.label ?? null, createdAt: row.createdAt?.toDate?.().toISOString() ?? new Date().toISOString() };
      }));
    } catch {
      setError("COULD NOT LOAD USERS");
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
          navigate({ to: "/admin", replace: true });
          return;
      }
      void load();
    });
  }, [load, navigate]);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("");
    setError("");
    setBusy(true);
    try {
      if (username.trim().length < 4) {
        setError("USERNAME MUST BE AT LEAST 4 CHARACTERS");
        return;
      }
      if (password.length < 8) {
        setError("PASSWORD MUST BE AT LEAST 8 CHARACTERS");
        return;
      }
      const email = username.trim();
      const auth = getSecondaryAuth();
      const credential = await import("firebase/auth").then(({ createUserWithEmailAndPassword }) => createUserWithEmailAndPassword(auth, email, password));
      await addDoc(collection(firebaseDb, "adminUsers"), {
        uid: credential.user.uid,
        username: email,
        passwordHash: await hashPassword(password),
        label: label.trim() || null,
        createdAt: serverTimestamp(),
      });
      await import("firebase/auth").then(({ signOut }) => signOut(auth));
      if (!credential.user.uid) {
        setError("COULD NOT CREATE THE USER");
        return;
      }
      setNotice("USER CREATED");
      setUsername("");
      setPassword("");
      setLabel("");
      await load();
    } catch {
      setError("COULD NOT CREATE THE USER");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    setNotice("");
    setError("");
    try {
      await deleteDoc(doc(firebaseDb, "adminUsers", id));
      setNotice("USER REMOVED");
    } catch {
      setError("COULD NOT REMOVE THE USER");
    }
    await load();
  };

  return (
    <section className="admin-page" aria-labelledby="admin-users-title">
      <div className="admin-inner">
        <header className="admin-head">
          <div>
            <p className="eyebrow">ORGANISER CONSOLE</p>
            <h1 id="admin-users-title">USER MANAGEMENT</h1>
          </div>
          <Link className="secondary-cta" to="/admin/dashboard">
            <ArrowLeft aria-hidden="true" size={12} /> REGISTRATIONS
          </Link>
        </header>

        <form className="admin-card admin-card-inline" onSubmit={onCreate}>
          <h2><UserPlus aria-hidden="true" size={14} /> CREATE A NEW USER</h2>

          <label className="admin-label" htmlFor="new-username">USERNAME</label>
          <input
            id="new-username"
            className="admin-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="admin-label" htmlFor="new-password">PASSWORD (MIN 8 CHARACTERS)</label>
          <input
            id="new-password"
            className="admin-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="admin-label" htmlFor="new-label">NAME / ROLE (OPTIONAL)</label>
          <input
            id="new-label"
            className="admin-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          {error && <p className="register-error" role="alert">{error}</p>}
          {notice && <p className="admin-notice" role="status">{notice}</p>}

          <button type="submit" className="primary-cta" disabled={busy}>
            {busy ? "CREATING…" : "CREATE USER"} <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="admin-rows">
          {users.map((user) => (
            <article className="admin-row" key={user.id}>
              <div className="admin-row-main">
                <h2>{user.username}</h2>
                <p className="admin-muted">
                  {user.label ?? "ORGANISER"} · ADDED {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="admin-row-side">
                <button type="button" className="secondary-cta" onClick={() => void onDelete(user.id)}>
                  <Trash2 aria-hidden="true" size={12} /> REMOVE
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
