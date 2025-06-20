import React, { useEffect, useState } from 'react';
import { TimeOption } from '../../types/Event';
import { Box, Button, FormControlLabel, Radio, Typography } from '@mui/material';
import TimeOptionFieldsForm from './TimeOptionFieldsForm';
import { Add } from '@mui/icons-material';
import DateTimeForm from './DateTimeForm';

interface TimeOptionFormProps {
  onSubmit?: (timeOptions: TimeOption[], votingDeadline?: string) => void;
}

const generateId = (() => {
  let id = 0;
  return () => ++id;
})();

const TimeOptionsModal: React.FC<TimeOptionFormProps> = () => {
  const [optionType, setOptionType] = useState<1 | 2 | 3>(1);
  const [votingDeadline, setVotingDeadline] = useState('');
  const [singleOption, setSingleOption] = useState<TimeOption>({
    id: 0,
    startTime: '',
    endTime: '',
    maxCapacity: 0,
    deadline: '',
    createdAt: '',
    // add other TimeOption required fields as needed
  });
  const [multipleOptions, setMultipleOptions] = useState<TimeOption[]>([]);
  //const [errors, setErrors] = React.useState<{ startTime?: string; endTime?: string }>({});
  /*function validateDateTime(value: string): string | null {
    if (!value) {
      return 'This field is required.';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Invalid date/time format.';
    }
    const now = new Date();
    now.setSeconds(0, 0); // match input granularity
    if (date < now) {
      return 'Date/time cannot be in the past.';
    }
    return null;
  }

  const tomorrowMidnightISO = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  }, []);

  function validateStartEndTimes(start: string, end: string): string | null {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (start && end && endDate <= startDate) {
      return 'End Time must be after Start Time.';
    }
    return null;
  }
  const handleStartTimeChange = (value: string) => {
    setSingleOption({ ...singleOption, startTime: value });

    const error = validateDateTime(value);
    let endError = null;

    if (!error && singleOption.endTime) {
      endError = validateStartEndTimes(value, singleOption.endTime);
    }

    setErrors((prev) => ({
      ...prev,
      startTime: error || undefined,
      endTime: endError || undefined,
    }));
  };

  const handleEndTimeChange = (value: string) => {
    setSingleOption((prev) => ({ ...prev, endTime: value }));

    const error = validateDateTime(value);
    let endError = null;

    if (!error && singleOption.startTime) {
      endError = validateStartEndTimes(singleOption.startTime, value);
    }

    setErrors((prev) => ({
      ...prev,
      endTime: error || endError || undefined,
    }));
  };*/

  useEffect(() => {
    if ((optionType === 2 || optionType === 3) && multipleOptions.length === 0) {
      setMultipleOptions([
        {
          id: generateId(),
          startTime: '',
          endTime: '',
          maxCapacity: undefined,
          deadline: '',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [multipleOptions.length, optionType]);

  const addOption = () => {
    if (multipleOptions.length >= 6) return;
    setMultipleOptions((prevOptions) => [
      ...prevOptions,
      {
        id: generateId(),
        startTime: '',
        endTime: '',
        maxCapacity: undefined,
        deadline: '',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const removeOption = (id: number) => {
    setMultipleOptions((prevOptions) => prevOptions.filter((opt) => opt.id !== id));
    console.log(votingDeadline);
  };

  const updateOption = (
    id: number,
    field: 'startTime' | 'endTime' | 'maxCapacity',
    value: string,
  ) => {
    setMultipleOptions((prevOptions) =>
      prevOptions.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              [field]: field === 'maxCapacity' ? (value ? Number(value) : undefined) : value,
            }
          : opt,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* if (optionType === 1) {
      if (!singleOption.startTime || !singleOption.endTime) {
        alert('Please fill in both the start and end times for your event.');
        return;
      }

      const to: TimeOption = {
        id: generateId(),
        startTime: singleOption.startTime,
        endTime: singleOption.endTime,
        deadline: '',
        createdAt: new Date().toISOString(),
      };
      onSubmit([to]);
    } else {
      if (!votingDeadline) {
        alert('Please set a deadline for voting on the event times.');
        return;
      }

      for (const opt of multipleOptions) {
        if (!opt.startTime || !opt.endTime) {
          alert('Please make sure every time option has both a start and end time.');
          return;
        }
        if (optionType === 3 && (opt.maxCapacity === undefined || opt.maxCapacity <= 0)) {
          alert('Please provide a valid maximum participant limit for each time option.');
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
    }*/
  };

  return (
    <Box component="form" onSubmit={handleSubmit} style={styles.form}>
      <Box display="flex" flexDirection="column" gap={3} marginLeft={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          Choose How You Want to Schedule Your Event
        </Typography>
        <Box display="flex" flexDirection="column">
          <FormControlLabel
            control={
              <Radio checked={optionType === 1} onChange={() => setOptionType(1)} value={1} />
            }
            label="Schedule One Specific Time"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 2} onChange={() => setOptionType(2)} value={2} />
            }
            label="Let Participants Vote on the Best Time (Up to 6 options)"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 3} onChange={() => setOptionType(3)} value={3} />
            }
            label="Create Multiple Time Slots with Capacity Limits"
          />
        </Box>
      </Box>

      <hr style={styles.divider} />

      {optionType === 1 && (
        <TimeOptionFieldsForm
          opt={singleOption}
          index={0}
          optionType={optionType}
          updateOption={(id, field, value) => {
            setSingleOption((prev) => ({ ...prev, [field]: value }));
          }}
          removeOption={() => {
            // No remove for single option - can be noop or no button shown in form
          }}
          multipleOptionsLength={1} // single option count is 1
        />
      )}

      {(optionType === 2 || optionType === 3) && (
        <>
          <Box style={styles.labelGroup}>
            <Typography style={styles.labelAbove}>Voting Deadline</Typography>

            <DateTimeForm label="" required onValidChange={(e) => setVotingDeadline(e)} />
          </Box>

          <Typography sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            Time Options (You can add up to 6)
          </Typography>
          {multipleOptions.map((opt, i) => (
            <TimeOptionFieldsForm
              key={opt.id}
              opt={opt}
              index={i}
              optionType={optionType}
              updateOption={updateOption}
              removeOption={removeOption}
              multipleOptionsLength={multipleOptions.length}
            />
          ))}

          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              sx={{ width: '70%' }}
              startIcon={<Add />}
              onClick={addOption}
              disabled={multipleOptions.length >= 6}
            >
              Add Time Option
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '100%',
    margin: '0 auto',
    paddingLeft: 10,
    paddingRight: 10,

    paddingTop: 0,
    borderRadius: 12,
    backgroundColor: '#f5f5dc',
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'fit-content',
  },
  radioLabel: {
    fontSize: 14,
    color: '#444',
  },
  divider: {
    margin: '24px 0',
    borderColor: '#ddd',
  },
  labelGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // center content inside
    marginBottom: 12,
    maxWidth: '100%',
    marginLeft: 'auto', // horizontal centering
    marginRight: 'auto',
    marginTop: 16,
  },

  labelAbove: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  uniformInput: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  singleOptionContainer: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  optionCard: {
    position: 'relative',
    padding: 16,
    border: '1px solid #d0d0d0',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  optionRow: {
    display: 'flex',
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  addButton: {
    padding: '8px 14px',
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    border: 'none',
    background: '#f44336',
    color: '#fff',
    borderRadius: '50%',
    width: 24,
    height: 24,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  submitBtn: {
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default TimeOptionsModal;
