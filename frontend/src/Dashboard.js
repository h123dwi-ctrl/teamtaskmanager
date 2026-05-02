import { useEffect, useState } from "react";
import axios from "axios";

// 🔥 CHANGE HERE (YOUR LIVE BACKEND)
const API_URL = "https://web-production-09ee3.up.railway.app";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [projectName, setProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_URL}/profile`, { headers }).then(res => setProfile(res.data));
    axios.get(`${API_URL}/tasks`, { headers }).then(res => setTasks(res.data));
    axios.get(`${API_URL}/projects`, { headers }).then(res => setProjects(res.data));
    axios.get(`${API_URL}/dashboard-stats`, { headers }).then(res => setStats(res.data));

    // 🔥 Admin safe fetch
    axios.get(`${API_URL}/users`, { headers })
      .then(res => setMembers(res.data))
      .catch(() => {});
  }, [token]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const createProject = async () => {
    try {
      if (!projectName.trim()) return;

      await axios.post(`${API_URL}/projects`,
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectName("");
      setMessage("Project created ✅");

    } catch {
      setError("Only admin can create project ❌");
    }
  };

  const createTask = async () => {
    if (!title || !projectId || !assignedTo) {
      setError("Fill all fields");
      return;
    }

    try {
      await axios.post(`${API_URL}/tasks`,
        {
          title,
          description,
          project_id: Number(projectId),
          assigned_to: Number(assignedTo),
          due_date: dueDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setProjectId("");
      setAssignedTo("");
      setDueDate("");
      setMessage("Task created ✅");

    } catch {
      setError("Only admin can create task ❌");
    }
  };

  const updateStatus = async (taskId) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}/status`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(res.data);
    } catch {
      setError("Update failed ❌");
    }
  };

  return (
    <div style={page}>

      <h1 style={titleStyle}>🚀 Team Task Manager</h1>

      {profile && (
        <p style={{ textAlign: "center" }}>
          Welcome <b>{profile.name}</b> ({profile.role})
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <button style={btn} onClick={logout}>Logout</button>
      </div>

      {message && <p style={success}>{message}</p>}
      {error && <p style={err}>{error}</p>}

      {/* Stats */}
      {stats && (
        <div style={statsBox}>
          <Card title="Tasks" value={stats.total} />
          <Card title="Completed" value={stats.completed} />
          <Card title="Pending" value={stats.pending} />
        </div>
      )}

      {/* Admin */}
      {profile?.role === "admin" && (
        <div style={panel}>
          <h2>Admin Panel</h2>

          <input placeholder="Project name" style={input}
            value={projectName}
            onChange={e => setProjectName(e.target.value)} />

          <button style={btn} onClick={createProject}>Create Project</button>

          <hr />

          <input placeholder="Task title" style={input}
            value={title}
            onChange={e => setTitle(e.target.value)} />

          <textarea placeholder="Description" style={input}
            value={description}
            onChange={e => setDescription(e.target.value)} />

          <select style={input} value={projectId}
            onChange={e => setProjectId(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select style={input} value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}>
            <option value="">Assign User</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          <input type="date" style={input}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)} />

          <button style={btn} onClick={createTask}>Create Task</button>
        </div>
      )}

      {/* Tasks */}
      <h2 style={{ textAlign: "center" }}>Tasks</h2>

      <div style={taskGrid}>
        {tasks.map(task => (
          <div key={task.id} style={taskCard}>
            <h3>{task.title}</h3>
            <p>Status: <b>{task.status}</b></p>

            {task.due_date &&
              new Date(task.due_date) < new Date() &&
              task.status !== "completed" && (
                <p style={{ color: "red" }}>⚠️ Overdue</p>
            )}

            {task.status !== "completed" && (
              <button style={smallBtn} onClick={() => updateStatus(task.id)}>
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

/* UI STYLES */

const page = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: "20px"
};

const titleStyle = {
  textAlign: "center",
  color: "#4f46e5"
};

const btn = {
  padding: "10px 15px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  margin: "10px"
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const panel = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "500px",
  margin: "20px auto",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const statsBox = {
  display: "flex",
  justifyContent: "center",
  gap: "20px"
};

const taskGrid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const taskCard = {
  background: "white",
  padding: "15px",
  margin: "10px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
};

const smallBtn = {
  background: "green",
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const success = { color: "green", textAlign: "center" };
const err = { color: "red", textAlign: "center" };

const Card = ({ title, value }) => (
  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    width: "120px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }}>
    <h4>{title}</h4>
    <p style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</p>
  </div>
);