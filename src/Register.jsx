import { useState} from 'react';
function Register(){
    const[formdata, setFormData] = useState({ name:'', email:'', password: ''});
const[msg, setMsg] = useState('');

const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
         const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch('http://locolhost:5000/api/Register', {
           method: 'POST',
           headers: {'content-Type': 'application/json'},
           body:JSON.stringfy(formData), 
        });
        const data = await res.json();
        setMsg(data.success ? "Account created!" : data.error);
    } catch (error){
        setMsg("server error");
    }
    };
    return(
       <div className="login-form">
      <h2>Create Account</h2>
      {msg && <p className="status">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Full Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" className="login-button">Register</button>
      </form>
    </div>
  );
}

export default Register; 
