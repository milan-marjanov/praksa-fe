import React, { useState } from "react";

export interface TimeOption {
  id: number;
  maxCapacity?: number;
  startTime: string;
  endTime: string;
  deadline: string;
  createdAt: string;
}

interface TimeOptionFormProps {
  onSubmit: (timeOptions: TimeOption[], votingDeadline?: string) => void;
}

const generateId = (() => {
  let id = 0;
  return () => ++id;
})();

const TimeOptionsForm: React.FC<TimeOptionFormProps> = ({ onSubmit }) => {
  const [optionType, setOptionType] = useState<1 | 2 | 3>(1);
  const [votingDeadline, setVotingDeadline] = useState("");
  const [singleOption, setSingleOption] = useState({ startTime: "", endTime: "" });
  const [multipleOptions, setMultipleOptions] = useState([
    { id: generateId(), startTime: "", endTime: "", maxCapacity: undefined },
  ]);

  const addOption = () => {
    if (multipleOptions.length >= 6) return;
    setMultipleOptions([
      ...multipleOptions,
      { id: generateId(), startTime: "", endTime: "", maxCapacity: undefined },
    ]);
  };

  const removeOption = (id: number) => {
    setMultipleOptions(multipleOptions.filter((opt) => opt.id !== id));
  };

  const updateOption = (
    id: number,
    field: "startTime" | "endTime" | "maxCapacity",
    value: string
  ) => {
    setMultipleOptions(
      multipleOptions.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              [field]: field === "maxCapacity" ? (value ? Number(value) : undefined) : value,
            }
          : opt
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (optionType === 1) {
      if (!singleOption.startTime || !singleOption.endTime) {
        alert("Please fill in both the start and end times for your event.");
        return;
      }

      const to: TimeOption = {
        id: generateId(),
        startTime: singleOption.startTime,
        endTime: singleOption.endTime,
        deadline: "",
        createdAt: new Date().toISOString(),
      };
      onSubmit([to]);
    } else {
      if (!votingDeadline) {
        alert("Please set a deadline for voting on the event times.");
        return;
      }

      for (const opt of multipleOptions) {
        if (!opt.startTime || !opt.endTime) {
          alert("Please make sure every time option has both a start and end time.");
          return;
        }
        if (optionType === 3 && (opt.maxCapacity === undefined || opt.maxCapacity <= 0)) {
          alert("Please provide a valid maximum participant limit for each time option.");
          return;
        }
      }

      const timeOptions: TimeOption[] = multipleOptions.map((opt) => ({
        id: opt.id,
        startTime: opt.startTime,
        endTime: opt.endTime,
        maxCapacity: opt.maxCapacity,
        deadline: votingDeadline,
        createdAt: new Date().toISOString(),
      }));
      onSubmit(timeOptions, votingDeadline);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Choose How You Want to Schedule Your Event</h2>

      <div style={styles.optionGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="optionType"
            value={1}
            checked={optionType === 1}
            onChange={() => setOptionType(1)}
          />
          Schedule One Specific Time (Single start and end)
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="optionType"
            value={2}
            checked={optionType === 2}
            onChange={() => setOptionType(2)}
          />
          Let Participants Vote on the Best Time (Up to 6 options)
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="optionType"
            value={3}
            checked={optionType === 3}
            onChange={() => setOptionType(3)}
          />
          Create Multiple Time Slots with Capacity Limits
        </label>
      </div>

      <hr style={styles.divider} />

      {optionType === 1 && (
        <div style={styles.singleOptionContainer}>
          <div style={styles.labelGroup}>
            <label style={styles.labelAbove}>Event Start Time</label>
            <input
              type="datetime-local"
              value={singleOption.startTime}
              onChange={(e) => setSingleOption({ ...singleOption, startTime: e.target.value })}
              style={styles.uniformInput}
              required
            />
          </div>
          <div style={styles.labelGroup}>
            <label style={styles.labelAbove}>Event End Time</label>
            <input
              type="datetime-local"
              value={singleOption.endTime}
              onChange={(e) => setSingleOption({ ...singleOption, endTime: e.target.value })}
              style={styles.uniformInput}
              required
            />
          </div>
        </div>
      )}

      {(optionType === 2 || optionType === 3) && (
        <>
          <div style={styles.labelGroup}>
            <label style={styles.labelAbove}>Voting Deadline</label>
            <input
              type="datetime-local"
              value={votingDeadline}
              onChange={(e) => setVotingDeadline(e.target.value)}
              style={styles.uniformInput}
              required
            />
            <small style={{ color: "#777", fontSize:'10px',  marginTop:4 }}>
              Set the date and time when voting will close
            </small>
          </div>

          <h4 style={{ marginTop: 20 }}>Time Options (You can add up to 6)</h4>
          {multipleOptions.map((opt) => (
            <div key={opt.id} style={styles.optionCard}>
              <div style={styles.optionRow}>
                <div style={styles.labelGroup}>
                  <label style={styles.labelAbove}>Start Time</label>
                  <input
                    type="datetime-local"
                    value={opt.startTime}
                    onChange={(e) => updateOption(opt.id, "startTime", e.target.value)}
                    style={styles.uniformInput}
                    required
                  />
                </div>
                <div style={styles.labelGroup}>
                  <label style={styles.labelAbove}>End Time</label>
                  <input
                    type="datetime-local"
                    value={opt.endTime}
                    onChange={(e) => updateOption(opt.id, "endTime", e.target.value)}
                    style={styles.uniformInput}
                    required
                  />
                </div>
              </div>
              {optionType === 3 && (
                <div style={styles.labelGroup}>
                  <label style={styles.labelAbove}>Max Participants Allowed</label>
                  <input
                    type="number"
                    min={1}
                    value={opt.maxCapacity ?? ""}
                    onChange={(e) => updateOption(opt.id, "maxCapacity", e.target.value)}
                    style={styles.uniformInput}
                    required
                  />
                  <small style={{ color: "#777", fontSize:'10px',  marginTop:4  }}>
                    Limit how many people can join at this time
                  </small>
                </div>
              )}
              {multipleOptions.length > 1 && (
                <button type="button" onClick={() => removeOption(opt.id)} style={styles.removeBtn}>
                  ✕
                </button>
              )}
            </div>
          ))}
          {multipleOptions.length < 6 && (
            <button type="button" onClick={addOption} style={styles.addButton}>
              + Add Another Time Option
            </button>
          )}
        </>
      )}

    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 24,
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
optionGroup: {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // contents aligned to left
  gap: 8,
  marginBottom: 16,
  marginLeft: "auto",
  marginRight: "auto",
  width: "fit-content",
},
  radioLabel: {
    fontSize: 14,
    color: "#444",
  },
  divider: {
    margin: "16px 0",
    borderColor: "#ddd",
  },
labelGroup: {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",      // center content inside
  marginBottom: 12,
  maxWidth: 195,
  marginLeft: "auto",        // horizontal centering
  marginRight: "auto",
},

  labelAbove: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontWeight: "600",
  },
  uniformInput: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  singleOptionContainer: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  optionCard: {
    position: "relative",
    padding: 16,
    border: "1px solid #d0d0d0",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  optionRow: {
    display: "flex",
    marginBottom: 12,
    flexWrap: "wrap",
        justifyContent: "center",

  },
  addButton: {
    padding: "8px 14px",
    fontSize: 14,
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 10,
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    border: "none",
    background: "#f44336",
    color: "#fff",
    borderRadius: "50%",
    width: 24,
    height: 24,
    fontWeight: "bold",
    cursor: "pointer",
  },
  submitBtn: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default TimeOptionsForm;
