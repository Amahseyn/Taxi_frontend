"use client";

import { useState } from "react";
import styles from "./BookingForm.module.css";
import DateTimePicker from "./DateTimePicker";

const AIRPORT_OPTIONS = [
  "Stansted", "Heathrow", "Gatwick", "Luton", "Southend",
  "London City", "Norwich", "Harwich", "Dover", "Southampton",
  "Birmingham", "East Midlands", "Leeds/Bradford", "Liverpool", "Manchester",
];

export default function BookingForm() {
  const [journey, setJourney] = useState("Airport/Seaport Drop-off");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postal: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    dropoffAddress1: "",
    dropoffCity: "",
    dropoffState: "",
    dropoffPostal: "",
    airportSeaport: "",
    flightNumber: "",
    returnDate: "",
    returnTime: "",
    returnFlightNumber: "",
    passengers: "1",
    bigSuitcases: "0",
    smallSuitcases: "0",
    otherInfo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!formData.date) next.date = true;
    if (!formData.time) next.time = true;
    if (journey === "Airport/Seaport Return") {
      if (!formData.returnDate) next.returnDate = true;
      if (!formData.returnTime) next.returnTime = true;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div id="booking-form" className={styles.card}>
        <h3 style={{ fontSize: "22px", fontWeight: "700" }}>Booking Submitted Successfully!</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginTop: "12px" }}>
          Thank you, <strong>{formData.firstName}</strong>. We have received your booking request
          {formData.airportSeaport ? ` for ${formData.airportSeaport}` : ""}.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
          Our dispatcher will contact you on <strong>{formData.phone}</strong> shortly to confirm and finalize your booking.
        </p>
        <button className="btn-primary" style={{ margin: "20px auto 0 auto" }} onClick={() => setSubmitted(false)}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div id="booking-form" className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Name <span className={styles.required}>*</span></legend>
          <div className={styles.row}>
            <div className={styles.group}>
              <input type="text" name="firstName" className={styles.input} required value={formData.firstName} onChange={handleChange} placeholder="First" />
              <label className={styles.sublabel}>First</label>
            </div>
            <div className={styles.group}>
              <input type="text" name="lastName" className={styles.input} required value={formData.lastName} onChange={handleChange} placeholder="Last" />
              <label className={styles.sublabel}>Last</label>
            </div>
          </div>
        </fieldset>

        {/* Address */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Address <span className={styles.required}>*</span></legend>
          <div className={styles.group}>
            <input type="text" name="address1" className={styles.input} required value={formData.address1} onChange={handleChange} placeholder="Address Line 1" />
          </div>
          <div className={styles.row} style={{ marginTop: "8px" }}>
            <div className={styles.group}>
              <input type="text" name="city" className={styles.input} required value={formData.city} onChange={handleChange} placeholder="City" />
              <label className={styles.sublabel}>City</label>
            </div>
            <div className={styles.group}>
              <input type="text" name="state" className={styles.input} required value={formData.state} onChange={handleChange} placeholder="State / Province / Region" />
              <label className={styles.sublabel}>State / Province / Region</label>
            </div>
            <div className={styles.group}>
              <input type="text" name="postal" className={styles.input} required value={formData.postal} onChange={handleChange} placeholder="Postal Code" />
              <label className={styles.sublabel}>Postal Code</label>
            </div>
          </div>
        </fieldset>

        {/* Phone & Email */}
        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Phone <span className={styles.required}>*</span></label>
            <input type="tel" name="phone" className={styles.input} required value={formData.phone} onChange={handleChange} />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Email <span className={styles.required}>*</span></label>
            <input type="email" name="email" className={styles.input} required value={formData.email} onChange={handleChange} />
          </div>
        </div>

        {/* Date / Time of Travel */}
        <div className={styles.group}>
          <label className={styles.label}>Date / Time of Travel <span className={styles.required}>*</span></label>
          <DateTimePicker
            dateValue={formData.date}
            timeValue={formData.time}
            onDateChange={handleChange}
            onTimeChange={handleChange}
            dateName="date"
            timeName="time"
            label="Date / Time of Travel"
          />
          {errors.date && <span className={styles.errorMsg}>Please choose a date.</span>}
          {errors.time && <span className={styles.errorMsg}>Please choose a time.</span>}
        </div>

        {/* Journey */}
        <div className={styles.group}>
          <label className={styles.label}>Journey <span className={styles.required}>*</span></label>
          <div className={styles.radioGroup}>
            {[
              "Airport/Seaport Drop-off",
              "Airport/Seaport Pick-up",
              "Event Transport",
              "Airport/Seaport Return",
            ].map((type) => (
              <label key={type} className={`${styles.radioLabel} ${journey === type ? styles.radioLabelSelected : ""}`}>
                <input
                  type="radio"
                  name="journey"
                  value={type}
                  checked={journey === type}
                  onChange={() => setJourney(type)}
                  className={styles.radioInput}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Drop-off (shown unless pick-up) */}
        {journey !== "Airport/Seaport Pick-up" && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Drop-off <span className={styles.required}>*</span></legend>
            <div className={styles.group}>
              <input type="text" name="dropoffAddress1" className={styles.input} required value={formData.dropoffAddress1} onChange={handleChange} placeholder="Address Line 1" />
            </div>
            <div className={styles.row} style={{ marginTop: "8px" }}>
              <div className={styles.group}>
                <input type="text" name="dropoffCity" className={styles.input} required value={formData.dropoffCity} onChange={handleChange} placeholder="City" />
                <label className={styles.sublabel}>City</label>
              </div>
              <div className={styles.group}>
                <input type="text" name="dropoffState" className={styles.input} required value={formData.dropoffState} onChange={handleChange} placeholder="State / Province / Region" />
                <label className={styles.sublabel}>State / Province / Region</label>
              </div>
              <div className={styles.group}>
                <input type="text" name="dropoffPostal" className={styles.input} required value={formData.dropoffPostal} onChange={handleChange} placeholder="Postal Code" />
                <label className={styles.sublabel}>Postal Code</label>
              </div>
            </div>
          </fieldset>
        )}

        {/* Airport / Seaport + Flight Number (shown unless event) */}
        {journey !== "Event Transport" && (
          <>
            <div className={styles.group}>
              <label className={styles.label}>Airport / Seaport <span className={styles.required}>*</span></label>
              <select name="airportSeaport" className={styles.select} required value={formData.airportSeaport} onChange={handleChange}>
                <option value="" disabled>Select an airport or seaport</option>
                {AIRPORT_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Flight / Ferry Number <span className={styles.required}>*</span></label>
              <input type="text" name="flightNumber" className={styles.input} required value={formData.flightNumber} onChange={handleChange} placeholder="e.g. EK030" />
            </div>
          </>
        )}

        {/* Return details (shown for return) */}
        {journey === "Airport/Seaport Return" && (
          <>
            <div className={styles.group}>
              <label className={styles.label}>Date / Time of Return <span className={styles.required}>*</span></label>
              <DateTimePicker
                dateValue={formData.returnDate}
                timeValue={formData.returnTime}
                onDateChange={handleChange}
                onTimeChange={handleChange}
                dateName="returnDate"
                timeName="returnTime"
                label="Date / Time of Return"
              />
              {errors.returnDate && <span className={styles.errorMsg}>Please choose a return date.</span>}
              {errors.returnTime && <span className={styles.errorMsg}>Please choose a return time.</span>}
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Return Flight / Ferry Number <span className={styles.required}>*</span></label>
              <input type="text" name="returnFlightNumber" className={styles.input} required value={formData.returnFlightNumber} onChange={handleChange} placeholder="e.g. EK030" />
            </div>
          </>
        )}

        {/* Capacity */}
        <div className={styles.row} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className={styles.group}>
            <label className={styles.label}>Passengers <span className={styles.required}>*</span></label>
            <select name="passengers" className={styles.select} value={formData.passengers} onChange={handleChange}>
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Big Suitcases <span className={styles.required}>*</span></label>
            <select name="bigSuitcases" className={styles.select} value={formData.bigSuitcases} onChange={handleChange}>
              {[0,1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Small Suitcases <span className={styles.required}>*</span></label>
            <select name="smallSuitcases" className={styles.select} value={formData.smallSuitcases} onChange={handleChange}>
              {[0,1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Other Information */}
        <div className={styles.group}>
          <label className={styles.label}>Other Information</label>
          <textarea name="otherInfo" className={styles.textarea} value={formData.otherInfo} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          Submit Booking
        </button>
      </form>
    </div>
  );
}
