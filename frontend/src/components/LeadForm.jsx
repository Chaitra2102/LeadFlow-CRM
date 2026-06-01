import { useState } from "react";
import API from "../services/api";

function LeadForm({ fetchLeads }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    source: "Website",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.source) {
      alert("Please fill all fields");
      return;
    }

    await API.post("/leads", form);

    setForm({
      name: "",
      email: "",
      source: "Website",
    });

    fetchLeads();
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <h2>Add New Lead</h2>

      <input
        type="text"
        placeholder="Enter Lead Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        type="email"
        placeholder="Enter Email Address"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <select
        value={form.source}
        onChange={(e) =>
          setForm({
            ...form,
            source: e.target.value,
          })
        }
      >
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Referral">Referral</option>
        <option value="Facebook">Facebook</option>
      </select>

      <button type="submit">
        Add Lead
      </button>
    </form>
  );
}

export default LeadForm;