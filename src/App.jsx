import { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('login'); // views: 'login', 'register', 'profile'
  const [status, setStatus] = useState('');
  
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- 1. LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Logging in...');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setName(data.user.name); 
        setStatus(`Welcome back, ${data.user.name}!`);
        setView('profile');
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) { setStatus("❌ Server offline."); }
  };

  // --- 2. REGISTER ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus('Creating account...');
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        setStatus("✅ Account Created! Please Login.");
        setView('login');
      } else {
        const data = await res.json();
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) { setStatus("❌ Registration failed."); }
  };

  // --- 3. UPDATE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Updating...');
    try {
      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, newPassword: password }),
      });
      if (res.ok) setStatus("✅ Profile updated!");
      else setStatus("❌ Update failed.");
    } catch (err) { setStatus("❌ Server error."); }
  };

  // --- 4. DELETE ---
  const handleDelete = async () => {
    if (!window.confirm("Permanently delete your account?")) return;
    try {
      const res = await fetch('http://localhost:5000/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("🗑️ Account deleted.");
        setView('login');
        setEmail(''); setPassword(''); setName('');
      }
    } catch (err) { setStatus("❌ Delete failed."); }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{view === 'login' ? "Login" : view === 'register' ? "Register" : "Edit Profile"}</h2>
        {status && <p className="status-msg">{status}</p>}

        <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleUpdate}>
          {(view !== 'login') && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={view === 'profile'} required />
          </div>
          <div className="input-group">
            <label>{view === 'profile' ? "New Password" : "Password"}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-button">
            {view === 'login' ? "Sign In" : view === 'register' ? "Join Now" : "Save Changes"}
          </button>
          
          {view === 'profile' && (
            <button type="button" onClick={handleDelete} className="login-button" style={{backgroundColor: '#ff4d4d', marginTop: '10px'}}>
              Delete Account
            </button>
          )}
        </form>

        <p className="toggle-text">
          {view === 'login' && <span onClick={() => setView('register')}>New here? Register</span>}
          {view === 'register' && <span onClick={() => setView('login')}>Back to Login</span>}
          {view === 'profile' && <span onClick={() => setView('login')}>Logout</span>}
        </p>
      </div>
    </div>
  );
}
export default App;