import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Services.css";

const materials = [
  { name: "PLA / PETG", detail: "Fast prototypes and jigs, multiple colors" },
  { name: "ABS / ASA", detail: "Functional parts with temperature resistance" },
  { name: "Nylon + CF", detail: "Structural components with industrial finish" },
  { name: "Resin (SLA)", detail: "High-detail miniatures, dental, and housings" },
];

const workflow = [
  { title: "Upload", copy: "Send STL/STEP or request help converting your DXF." },
  { title: "Review", copy: "We validate walls, tolerances, and recommend materials." },
  { title: "Print", copy: "Parts are produced, inspected, and packaged for dispatch." },
];

function PrintingServices() {
  const [quoteSent, setQuoteSent] = useState(false);

  const handleQuote = (event) => {
    event.preventDefault();
    setQuoteSent(true);
  };

  return (
    <div className="services page">
      <section className="services-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow">PRODUCTION LAB</p>
            <h1 className="section-title">3D Printing</h1>
            <p className="section-subtitle">
              Industrial FDM, resin, and nylon parts with dimensional reports, sealed packaging, and Nairobi pickup or courier
              delivery.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container services-packages">
        <div className="grid grid-4">
          {materials.map((material) => (
            <motion.div
              className="card"
              key={material.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3>{material.name}</h3>
              <p>{material.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="services-process">
        <div className="container grid grid-3">
          {workflow.map((step, index) => (
            <motion.div
              className="process-card card"
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="process-label">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container services-form">
        <div className="grid grid-2">
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Request a Quote</h3>
            <p>Share part quantity, material, and tolerances. We will reply with cost + lead time.</p>
            {quoteSent && <div className="alert alert-success">Quote request received. We will respond shortly.</div>}
            <form onSubmit={handleQuote}>
              <div className="form-group">
                <label className="form-label" htmlFor="parts">
                  Part Description
                </label>
                <textarea id="parts" className="form-textarea" placeholder="Gearbox housing, 10 units, +/-0.2mm"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="material">
                  Preferred Material
                </label>
                <select id="material" className="form-select">
                  {materials.map((material) => (
                    <option key={material.name}>{material.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact">
                  Contact Email
                </label>
                <input id="contact" className="form-input" type="email" placeholder="you@example.com" />
              </div>
              <button type="submit" className="btn btn-primary">
                Send Request
              </button>
            </form>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Quality Assurances</h3>
            <ul className="services-list">
              <li>Dimensional report with caliper snapshots</li>
              <li>Post-processing: vapor smoothing, dye, or epoxy</li>
              <li>Functional testing for moving assemblies</li>
              <li>Protective packaging for export shipments</li>
              <li>Same-day rush printing available on request</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default PrintingServices;
