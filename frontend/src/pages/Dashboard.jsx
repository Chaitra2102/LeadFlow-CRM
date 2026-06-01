import { useEffect, useState } from "react";
import API from "../services/api";
import LeadForm from "../components/LeadForm";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [noteText, setNoteText] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await API.get("/leads");
    setLeads(res.data);
  };

  const addNote = async (leadId) => {
    if (!noteText[leadId]) return;

    await API.post(`/leads/${leadId}/notes`, {
      text: noteText[leadId],
    });

    setNoteText({ ...noteText, [leadId]: "" });
    fetchLeads();
  };

  const updateNote = async (leadId, noteId) => {
    if (!editNoteText) return;

    await API.put(`/leads/${leadId}/notes/${noteId}`, {
      text: editNoteText,
    });

    setEditingNote(null);
    setEditNoteText("");
    fetchLeads();
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.source.toLowerCase().includes(search.toLowerCase()) ||
      lead.status.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1>LeadFlow CRM</h1>
          <p className="subtitle">Manage client leads, follow-ups, and conversions</p>
        </div>

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="cards">
        <div className="card total">
          <h3>Total Leads</h3>
          <p>{leads.length}</p>
        </div>

        <div className="card new">
          <h3>New</h3>
          <p>{leads.filter((lead) => lead.status === "new").length}</p>
        </div>

        <div className="card contacted">
          <h3>Contacted</h3>
          <p>{leads.filter((lead) => lead.status === "contacted").length}</p>
        </div>

        <div className="card converted">
          <h3>Converted</h3>
          <p>{leads.filter((lead) => lead.status === "converted").length}</p>
        </div>
      </div>
        <div className="source-card">
  <h3>Lead Sources</h3>

  <div className="source-grid">
    <p>Website: {leads.filter((lead) => lead.source === "Website").length}</p>
    <p>Instagram: {leads.filter((lead) => lead.source === "Instagram").length}</p>
    <p>LinkedIn: {leads.filter((lead) => lead.source === "LinkedIn").length}</p>
    <p>Referral: {leads.filter((lead) => lead.source === "Referral").length}</p>
    <p>Facebook: {leads.filter((lead) => lead.source === "Facebook").length}</p>
  </div>
</div>
      <LeadForm fetchLeads={fetchLeads} />

      <input
        type="text"
        placeholder="Search by name, email, source, or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <h3>No leads found</h3>
          <p>Try another search or add a new lead.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Updated</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.source}</td>

                <td>
                  <span className={`status-badge status-${lead.status}`}>
                    {lead.status}
                  </span>

                  <br />

                  <select
                    value={lead.status}
                    onChange={async (e) => {
                      await API.put(`/leads/${lead._id}/status`, {
                        status: e.target.value,
                      });
                      fetchLeads();
                    }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </td>

                <td>{formatDate(lead.createdAt)}</td>
                <td>{formatDate(lead.updatedAt)}</td>

                <td>
                  <div className="notes-list">
                    {Array.isArray(lead.notes) &&
                      lead.notes.map((note) => (
                        <div key={note._id} className="note-item">
                          {editingNote === note._id ? (
                            <>
                              <input
                                type="text"
                                value={editNoteText}
                                onChange={(e) =>
                                  setEditNoteText(e.target.value)
                                }
                              />

                              <button onClick={() => updateNote(lead._id, note._id)}>
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNote(null);
                                  setEditNoteText("");
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <p>• {note.text}</p>
                              <small>{note.createdAt && formatDate(note.createdAt)}</small>

                              <br />

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNote(note._id);
                                  setEditNoteText(note.text);
                                }}
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add note..."
                    value={noteText[lead._id] || ""}
                    onChange={(e) =>
                      setNoteText({
                        ...noteText,
                        [lead._id]: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => addNote(lead._id)}>Add Note</button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this lead?"
                      );

                      if (!confirmDelete) return;

                      await API.delete(`/leads/${lead._id}`);
                      fetchLeads();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer className="footer">
        Built by Pillella Chaitra Sree | Future Interns Task 2 | LeadFlow CRM
      </footer>
    </div>
  );
}

export default Dashboard;