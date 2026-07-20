"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./BookingForm.module.css";
import DateTimePicker from "./DateTimePicker";
import AddressAutocomplete from "./AddressAutocomplete";
import MapPickerModal from "./MapPickerModal";
import { estimateVehiclePrice, hasTimeSurcharge } from "../lib/pricing";

const API_BASE = "/api/v1";

const JOURNEY_TYPES = [
  { value: "Airport Drop-off", label: "Airport Drop-off" },
  { value: "Airport Pickup", label: "Airport Pickup" },
  { value: "Return Airport Transfer", label: "Return Airport Transfer" },
  { value: "Local Journey", label: "Local Journey" },
  { value: "Long Distance", label: "Long Distance" },
];

export default function BookingForm() {
  const [airports, setAirports] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [quotes, setQuotes] = useState({}); // vehicle_code -> quote data
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [noticeWarning, setNoticeWarning] = useState("");
  const [showMapFor, setShowMapFor] = useState(null); // "pickup" | "destination" | null

  const [formData, setFormData] = useState({
    journey_type: "Local Journey",
    pickup_address: "",
    pickup_postcode: "",
    pickup_lat: 51.896,
    pickup_lng: 0.892,
    destination_address: "",
    destination_postcode: "",
    destination_lat: 51.896,
    destination_lng: 0.892,
    airport_code: "",
    terminal: "",
    flight_number: "",
    travel_date: "",
    travel_time: "",

    // Return parameters
    return_date: "",
    return_time: "",
    return_flight_number: "",

    // Vehicle
    vehicle_code: "saloon",

    // Customer info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: 1,
    large_luggage: 0,
    small_luggage: 0,
    otherInfo: ""
  });

  const [errors, setErrors] = useState({});

  // Live route estimate (distance/duration) computed from the chosen addresses.
  const [route, setRoute] = useState({ loading: false, error: "", distanceMiles: 0, durationMinutes: 0 });
  const routeReqRef = useRef(0);
  const quotesReqRef = useRef(0);

  // Fetch airports and active vehicles from backend
  useEffect(() => {
    fetch(`${API_BASE}/airports`)
      .then((res) => res.json())
      .then((data) => setAirports(data || []))
      .catch((err) => console.error("Failed to load airports:", err));

    fetch(`${API_BASE}/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data || []))
      .catch((err) => console.error("Failed to load vehicles:", err));
  }, []);

  // Recompute distance/duration whenever the chosen addresses change.
  useEffect(() => {
    const { pickup_lat, pickup_lng, destination_lat, destination_lng } = formData;
    const hasPickup = typeof pickup_lat === "number" && typeof pickup_lng === "number" && (pickup_lat !== 51.896 || pickup_lng !== 0.892);
    const hasDest = typeof destination_lat === "number" && typeof destination_lng === "number" && (destination_lat !== 51.896 || destination_lng !== 0.892);
    if (!hasPickup || !hasDest) {
      return;
    }

    const reqId = ++routeReqRef.current;
    void (async () => {
      setRoute((r) => ({ ...r, loading: true, error: "" }));
      await fetch("/api/distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: destination_lat, lng: destination_lng }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (reqId !== routeReqRef.current) return;
        if (!res.ok) throw new Error(data.error || "Route failed");
        setRoute({ loading: false, error: "", distanceMiles: data.distanceKm * 0.621371, durationMinutes: data.durationMin });
      })
      .catch((err) => {
        if (reqId !== routeReqRef.current) return;
        setRoute({ loading: false, error: err.message || "Could not calculate distance.", distanceMiles: 0, durationMinutes: 0 });
      });
    })();
  }, [formData.pickup_lat, formData.pickup_lng, formData.destination_lat, formData.destination_lng]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (type) => (s) => {
    const fullAddress = [s.housenumber, s.street, s.city].filter(Boolean).join(", ") || s.label;
    if (type === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickup_address: fullAddress,
        pickup_postcode: s.postal,
        pickup_lat: s.lat,
        pickup_lng: s.lng,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        destination_address: fullAddress,
        destination_postcode: s.postal,
        destination_lat: s.lat,
        destination_lng: s.lng,
      }));
    }
  };

  const handleMapSelect = (type) => (s) => {
    const fullAddress =
      [s.housenumber, s.street, s.city].filter(Boolean).join(", ") ||
      s.label ||
      `Pinned location (${Number(s.lat).toFixed(4)}, ${Number(s.lng).toFixed(4)})`;
    if (type === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickup_address: fullAddress,
        pickup_postcode: s.postal,
        pickup_lat: s.lat,
        pickup_lng: s.lng,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        destination_address: fullAddress,
        destination_postcode: s.postal,
        destination_lat: s.lat,
        destination_lng: s.lng,
      }));
    }
    setShowMapFor(null);
  };

  // Validation for the whole combined form.
  const validateAll = () => {
    const validationErrors = {};

    if (!formData.pickup_address) validationErrors.pickup_address = true;
    if (!formData.destination_address) validationErrors.destination_address = true;
    if (!formData.travel_date) validationErrors.travel_date = true;
    if (!formData.travel_time) validationErrors.travel_time = true;

    if (formData.journey_type === "Airport Pickup" && !formData.flight_number) {
      validationErrors.flight_number = true;
    }

    if (formData.journey_type === "Return Airport Transfer") {
      if (!formData.return_date) validationErrors.return_date = true;
      if (!formData.return_time) validationErrors.return_time = true;
    }

    if (!formData.vehicle_code) validationErrors.vehicle_code = true;

    if (!formData.firstName) validationErrors.firstName = true;
    if (!formData.lastName) validationErrors.lastName = true;
    if (!formData.email) validationErrors.email = true;
    if (!formData.phone) validationErrors.phone = true;

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAll();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setErrorMsg("");
    setNoticeWarning("");

    try {
      // Fetch quotes for all available vehicles to validate notice window.
      const quotesData = {};
      let isNoticeAllowed = true;
      let blockReason = "";

      for (const v of vehicles) {
        const res = await fetch(`${API_BASE}/bookings/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            journey_type: formData.journey_type,
            pickup_address: formData.pickup_address,
            pickup_lat: formData.pickup_lat,
            pickup_lng: formData.pickup_lng,
            destination_address: formData.destination_address,
            destination_lat: formData.destination_lat,
            destination_lng: formData.destination_lng,
            vehicle_code: v.code,
            airport_code: formData.airport_code || null,
            travel_date: formData.travel_date,
            travel_time: formData.travel_time
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Pricing matrix retrieval failed.");
        }

        const data = await res.json();
        quotesData[v.code] = data;
        isNoticeAllowed = data.notice_allowed;
        blockReason = data.notice_reason;
      }

      if (!isNoticeAllowed) {
        setNoticeWarning(blockReason);
        setLoading(false);
        return;
      }

      setQuotes(quotesData);

      // Build booking payload and create the booking / Stripe session.
      const payload = {
        journey_type: formData.journey_type,
        pickup_address: formData.pickup_address,
        pickup_postcode: formData.pickup_postcode || null,
        pickup_lat: formData.pickup_lat,
        pickup_lng: formData.pickup_lng,
        destination_address: formData.destination_address,
        destination_postcode: formData.destination_postcode || null,
        destination_lat: formData.destination_lat,
        destination_lng: formData.destination_lng,
        airport_code: formData.airport_code || null,
        terminal: formData.terminal || null,
        flight_number: formData.flight_number || null,
        vehicle_code: formData.vehicle_code,
        passengers: parseInt(formData.passengers),
        large_luggage: parseInt(formData.large_luggage),
        small_luggage: parseInt(formData.small_luggage),
        travel_date: formData.travel_date,
        travel_time: formData.travel_time,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      };

      if (formData.journey_type === "Return Airport Transfer") {
        payload.return_journey_data = {
          return_date: formData.return_date,
          return_time: formData.return_time,
          return_flight_number: formData.return_flight_number || null
        };
      }

      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Booking creation failed.");
      }

      const data = await res.json();
      if (data.stripe_session_url) {
        window.location.href = data.stripe_session_url;
      } else {
        throw new Error("Stripe checkout URL not returned.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to process booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="booking-form" className={styles.card}>
      {errorMsg && (
        <div style={{ padding: "12px", background: "#fdf0f0", color: "#a60f0a", borderRadius: "8px", fontWeight: "600" }}>
          {errorMsg}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* SECTION: Journey Details */}
        <h3 className={styles.sectionTitle}>Journey Details</h3>

        <div className={styles.group}>
          <label className={styles.label}>Journey Type</label>
          <select name="journey_type" className={styles.select} value={formData.journey_type} onChange={handleChange}>
            {JOURNEY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Pickup Address <span className={styles.required}>*</span></label>
            <AddressAutocomplete
              name="pickup_address"
              className={styles.input}
              required
              value={formData.pickup_address}
              onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
              onSelect={handleAddressSelect("pickup")}
              placeholder="Start typing pickup location..."
            />
            <button type="button" className={styles.pickMapBtn} onClick={() => setShowMapFor("pickup")}>
              Can&apos;t find your address? Pick it on the map
            </button>
            {errors.pickup_address && <span className={styles.errorMsg}>Pickup address is required.</span>}
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Destination Address <span className={styles.required}>*</span></label>
            <AddressAutocomplete
              name="destination_address"
              className={styles.input}
              required
              value={formData.destination_address}
              onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
              onSelect={handleAddressSelect("destination")}
              placeholder="Start typing destination location..."
            />
            <button type="button" className={styles.pickMapBtn} onClick={() => setShowMapFor("destination")}>
              Can&apos;t find your address? Pick it on the map
            </button>
            {errors.destination_address && <span className={styles.errorMsg}>Destination address is required.</span>}
          </div>
        </div>

        {(formData.pickup_address && formData.destination_address) && (
          <div className={styles.routeCard}>
            <div className={styles.routeLeg}>
              <span className={`${styles.routeDot} ${styles.routeDotPickup}`} />
              <span className={styles.routeAddr}>{formData.pickup_address}</span>
            </div>
            <div className={styles.routeLine} />
            <div className={styles.routeLeg}>
              <span className={`${styles.routeDot} ${styles.routeDotDest}`} />
              <span className={styles.routeAddr}>{formData.destination_address}</span>
            </div>
            <div className={styles.routeStats}>
              {route.loading ? (
                <span>Calculating distance &amp; time…</span>
              ) : route.error ? (
                <span className={styles.errorMsg}>{route.error}</span>
              ) : route.distanceMiles > 0 ? (
                <span>
                  <strong>{route.distanceMiles.toFixed(1)} miles</strong>
                  {" · "}
                  Est. time <strong>{Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m</strong>
                </span>
              ) : (
                <span>Distance &amp; time will appear here.</span>
              )}
            </div>
          </div>
        )}

        {(formData.journey_type.includes("Airport") || formData.journey_type.includes("Return")) && (
          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label}>Select Airport</label>
              <select name="airport_code" className={styles.select} value={formData.airport_code} onChange={handleChange}>
                <option value="">-- Choose Airport --</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>{a.name} ({a.code})</option>
                ))}
              </select>
            </div>

            <div className={styles.group}>
              <label className={styles.label}>Terminal / Flight Number</label>
              <input
                type="text"
                name="flight_number"
                placeholder="e.g. EK030"
                className={styles.input}
                value={formData.flight_number}
                onChange={handleChange}
              />
              {errors.flight_number && <span className={styles.errorMsg}>Flight number is required for Airport pickups.</span>}
            </div>
          </div>
        )}

        <div className={styles.group}>
          <label className={styles.label}>Departure Date & Time <span className={styles.required}>*</span></label>
          <DateTimePicker
            dateValue={formData.travel_date}
            timeValue={formData.travel_time}
            onDateChange={handleChange}
            onTimeChange={handleChange}
            dateName="travel_date"
            timeName="travel_time"
            label="Departure"
          />
          {errors.travel_date && <span className={styles.errorMsg}>Please enter travel date.</span>}
          {errors.travel_time && <span className={styles.errorMsg}>Please enter travel time.</span>}
        </div>

        {formData.journey_type === "Return Airport Transfer" && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Return Parameters</legend>
            <div className={styles.group}>
              <DateTimePicker
                dateValue={formData.return_date}
                timeValue={formData.return_time}
                onDateChange={handleChange}
                onTimeChange={handleChange}
                dateName="return_date"
                timeName="return_time"
                label="Return Date / Time"
              />
              {errors.return_date && <span className={styles.errorMsg}>Please enter return date.</span>}
              {errors.return_time && <span className={styles.errorMsg}>Please enter return time.</span>}
            </div>
            <div className={styles.group} style={{ marginTop: "10px" }}>
              <label className={styles.label}>Return Flight Number</label>
              <input
                type="text"
                name="return_flight_number"
                placeholder="e.g. BA249"
                className={styles.input}
                value={formData.return_flight_number}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* SECTION: Vehicle Selection */}
        <h3 className={styles.sectionTitle}>Select Your Vehicle</h3>

        {route.loading && (
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Calculating distance &amp; prices…</p>
        )}
        {route.error && (
          <p className={styles.errorMsg}>{route.error}</p>
        )}
        {!route.loading && route.distanceMiles > 0 && (
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Estimated distance: <strong>{route.distanceMiles.toFixed(1)} miles</strong>
            {" · "}
            Est. time: <strong>{Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m</strong>
            {hasTimeSurcharge(formData.travel_date, formData.travel_time) > 0 && (
              <span style={{ color: "#a60f0a" }}> · night/Sunday/bank-holiday rate applied</span>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {vehicles.length === 0 && (
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Loading available vehicles…</p>
          )}
          {vehicles.map((v) => {
            const live = estimateVehiclePrice(
              v.code,
              route.distanceMiles,
              formData.journey_type,
              formData.airport_code,
              formData.travel_date,
              formData.travel_time
            );
            const quote = quotes[v.code] || {};
            const price = live != null ? live : (quote.price || null);
            const selected = formData.vehicle_code === v.code;
            return (
              <div
                key={v.id}
                onClick={() => setFormData({ ...formData, vehicle_code: v.code })}
                className={`${styles.quoteRow} ${selected ? styles.quoteRowSelected : ""}`}
              >
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700" }}>{v.name}</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Max Passengers: {v.max_passengers} | Max Luggage: {v.large_luggage_capacity} Large, {v.small_luggage_capacity} Small
                  </p>
                </div>
                <div className={styles.quoteMeta}>
                  <span className={styles.quotePrice}>
                    {price != null ? `£${price}` : "—"}
                  </span>
                  <p className={styles.quoteSub}>
                    {route.distanceMiles > 0
                      ? `${route.distanceMiles.toFixed(0)} miles`
                      : (quote.distance_miles ? `${quote.distance_miles} miles` : "Enter addresses to see fare")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {errors.vehicle_code && <span className={styles.errorMsg}>Please choose a vehicle.</span>}

        {/* SECTION: Customer Details */}
        <h3 className={styles.sectionTitle}>Your Details</h3>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>First Name <span className={styles.required}>*</span></label>
            <input type="text" name="firstName" className={styles.input} value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <span className={styles.errorMsg}>First name is required.</span>}
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Last Name <span className={styles.required}>*</span></label>
            <input type="text" name="lastName" className={styles.input} value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <span className={styles.errorMsg}>Last name is required.</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
            <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} />
            {errors.email && <span className={styles.errorMsg}>Valid email is required.</span>}
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Phone Number <span className={styles.required}>*</span></label>
            <input type="tel" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className={styles.errorMsg}>Phone number is required.</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Number of Passengers</label>
            <input type="number" min="1" max="8" name="passengers" className={styles.input} value={formData.passengers} onChange={handleChange} />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Large Bags</label>
            <input type="number" min="0" name="large_luggage" className={styles.input} value={formData.large_luggage} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Notes or Requests</label>
          <textarea name="otherInfo" className={styles.textarea} value={formData.otherInfo} onChange={handleChange} placeholder="e.g. child seats required, extra stops..." />
        </div>

        {/* Summary */}
        {quotes[formData.vehicle_code]?.price && (
          <div className={styles.summaryCard}>
            <div><strong>Route:</strong> {formData.pickup_address} → {formData.destination_address}</div>
            <div><strong>Departure:</strong> {formData.travel_date} at {formData.travel_time}</div>
            <div><strong>Vehicle class:</strong> {formData.vehicle_code.toUpperCase()}</div>
            <div><strong>Contact:</strong> {formData.firstName} {formData.lastName} ({formData.phone})</div>
            {formData.journey_type === "Return Airport Transfer" && (
              <div><strong>Return Departure:</strong> {formData.return_date} at {formData.return_time}</div>
            )}
            <div className={styles.summaryTotal}>
              <span>Total Fixed Fare:</span>
              <span className={styles.summaryTotalValue}>£{quotes[formData.vehicle_code].price}</span>
            </div>
          </div>
        )}

        {noticeWarning && (
          <div style={{ padding: "16px", background: "#fdf0f0", border: "1px solid #e0c0c0", color: "#a60f0a", borderRadius: "8px", fontWeight: "700" }}>
            {noticeWarning}
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Processing…" : "Book & Pay with Stripe"}
        </button>
      </form>

      <MapPickerModal
        open={showMapFor !== null}
        title={showMapFor === "pickup" ? "Pick your pickup location" : "Pick your destination location"}
        initial={showMapFor === "pickup" ? { lat: formData.pickup_lat, lng: formData.pickup_lng } : { lat: formData.destination_lat, lng: formData.destination_lng }}
        onClose={() => setShowMapFor(null)}
        onSelect={showMapFor === "pickup" ? handleMapSelect("pickup") : handleMapSelect("destination")}
      />
    </div>
  );
}
