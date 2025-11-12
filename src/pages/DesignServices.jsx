import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Services.css";

const designPackages = [
  {
    title: "Concept Validation",
    description: "Quick sketches, basic CAD blocks, and feasibility reports for early-stage ideas.",
    turnaround: "3-5 days",
    deliverables: "Sketches, DXF, PDF",
  },
  {
    title: "Production Ready",
    description: "Detailed 2D/3D models with tolerances, exploded views, and fabrication notes.",
    turnaround: "7-10 days",
    deliverables: "DXF, STEP, Drawing set",
  },
  {
    title: "Embedded Collaboration",
    description: "Ongoing engineering support for startups needing weekly design bandwidth.",
    turnaround: "Monthly retainer",
    deliverables: "Custom",
  },
];

const processSteps = [
  { label: "01", title: "Requirements", copy: "Share sketches, specs, and reference files via our secure uploader." },
  { label: "02", title: "Concept", copy: "We ideate, share previews, and confirm critical constraints." },
  { label: "03", title: "Delivery", copy: "Receive manufacturing-ready packages plus optional walkthrough call." },
];

function DesignServices() {
  const [formState, setFormState] = useState({
    company: "",
    email: "",
    project: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="services page">
      <section className="services-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow">CUSTOM CAD</p>
            <h1 className="section-title">Design Services</h1>
            <p className="section-subtitle">
              Mechanical design, sheet-metal layouts, and photoreal renderings created by engineers who understand
              manufacturing realities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container services-packages">
        <div className="grid grid-3">
          {designPackages.map((pkg) => (
            <motion.div className="card" key={pkg.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <div className="package-meta">
                <span>Turnaround: {pkg.turnaround}</span>
                <span>Deliverables: {pkg.deliverables}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="services-process">
        <div className="container grid grid-3">
          {processSteps.map((step) => (
            <motion.div className="process-card card" key={step.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="process-label">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container services-form">
        <div className="grid grid-2">
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3>Project Brief</h3>
            <p>Share a short summary and we will respond within one business day.</p>
            {submitted && <div className="alert alert-success">Thanks! We will reach out shortly.</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="company">
                  Company / Team
                </label>
                <input id="company" name="company" className="form-input" value={formState.company} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input id="email" name="email" className="form-input" type="email" value={formState.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="project">
                  Project Overview
                </label>
                <textarea id="project" name="project" className="form-textarea" value={formState.project} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="budget">
                  Estimated Budget (KES)
                </label>
                <input id="budget" name="budget" className="form-input" value={formState.budget} onChange={handleChange} />
              </div>
              <button className="btn btn-primary" type="submit">
                Submit Brief
              </button>
            </form>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3>Capabilities</h3>
            <ul className="services-list">
              <li>Laser/CNC ready DXF creation</li>
              <li>3D modeling (SolidWorks, Fusion, Rhino)</li>
              <li>Finite element checks and tolerance stacks</li>
              <li>Exploded views and fabrication notes</li>
              <li>Rendering + documentation for investors</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default DesignServices;

