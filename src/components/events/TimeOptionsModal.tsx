import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Button, FormControlLabel, Radio, Typography } from '@mui/material';
import TimeOptionFieldsForm from './TimeOptionFieldsForm';
import { Add } from '@mui/icons-material';
import DateTimeForm from './DateTimeForm';
import { useEventForm } from '../../contexts/EventContext';
import { EventModalRef } from '../../types/Event';
import EventConfirmDialog from './EventConfirmDialog';

function generateId(min = 1, max = 10000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCurrentDatetimeLocal() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes() + 5).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface TimeOptionsModalProps {
  isUpdate: boolean;
}

const TimeOptionsModal = forwardRef<EventModalRef, TimeOptionsModalProps>(({ isUpdate }, ref) => {
  const { eventData, setEventData } = useEventForm();
  const timeOptions = eventData.timeOptions;
  const [validationErrors, setValidationErrors] = useState<Record<number | string, string>>({});
  const [openDialog, setOpenDialog] = useState(false);

  const [optionType, setOptionType] = useState<1 | 2 | 3>(() => {
    switch (eventData.timeOptionType) {
      case 'FIXED':
        return 1;
      case 'VOTING':
        return 2;
      case 'CAPACITY_BASED':
        return 3;
      default:
        return 1;
    }
  });

  useEffect(() => {
    setValidationErrors({});
  }, [optionType]);

  useEffect(() => {
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors['invalidOptions'];
      return newErrors;
    });
  }, [eventData.timeOptions?.length]);

  useEffect(() => {
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (timeOptions) {
        timeOptions.forEach((opt) => {
          const startValid = opt.startTime && opt.startTime.trim() !== '';
          const endValid = opt.endTime && opt.endTime.trim() !== '';

          if (startValid && endValid && newErrors[opt.id]) {
            delete newErrors[opt.id];
          }
        });
      }

      return newErrors;
    });
  }, [
    timeOptions?.map((opt) => opt.startTime).join('|'),
    timeOptions?.map((opt) => opt.endTime).join('|'),
  ]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let hasError = false;
      const now = new Date();
      const errors: Record<number | string, string> = {};

      if (!eventData?.timeOptions || eventData.timeOptions.length === 0) {
        errors['noOptions'] = 'No time options provided.';
        hasError = true;
      } else {
        eventData.timeOptions.forEach((opt, i) => {
          const index = i + 1;

          if (!opt.startTime || !opt.endTime) {
            errors[opt.id] = `Option ${index}: Start and end time are required.`;
            hasError = true;
            return;
          }

          const start = new Date(opt.startTime);
          const end = new Date(opt.endTime);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            errors[opt.id] = `Option ${index}: Invalid date format.`;
            hasError = true;
            return;
          }

          if (start <= now) {
            errors[opt.id] = `Option ${index}: Start time must be in the future.`;
            hasError = true;
          }

          if (end <= now) {
            errors[opt.id] = `Option ${index}: End time must be in the future.`;
            hasError = true;
          }

          if (start >= end) {
            errors[opt.id] = `Option ${index}: Start time must be before end time.`;
            hasError = true;
          }
        });
      }

      if (optionType === 2 || optionType === 3) {
        if (!eventData.votingDeadline) {
          //errors['votingDeadline'] = 'Voting deadline is required.';
          hasError = true;
        } else {
          const deadline = new Date(eventData.votingDeadline);
          if (isNaN(deadline.getTime())) {
            // errors['votingDeadline'] = 'Voting deadline has an invalid format.';
            hasError = true;
          } else if (deadline <= now) {
            // errors['votingDeadline'] = 'Voting deadline must be in the future.';
            hasError = true;
          }
        }
        if (
          eventData.timeOptions &&
          (eventData.timeOptions.length < 2 || eventData.timeOptions.length > 6)
        ) {
          errors['invalidOptions'] = 'Number of time options must be between 2 and 6.';
          hasError = true;
        }
      }

      setValidationErrors(errors);
      return { hasError, errors };
    },
  }));

  const votingDeadline = eventData.votingDeadline;

  useEffect(() => {
    if (eventData.timeOptions?.length === 0) {
      setEventData({
        timeOptions: [
          {
            id: generateId(),
            startTime: '',
            endTime: '',
            maxCapacity: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
    console.log(eventData);
  }, [optionType, eventData.timeOptions, setEventData, eventData]);

  const handleOptionTypeChange = (value: 1 | 2 | 3) => {
    const typeMap = {
      1: 'FIXED',
      2: 'VOTING',
      3: 'CAPACITY_BASED',
    } as const;

    const initialTimeOption = {
      id: generateId(),
      startTime: '',
      endTime: '',
      maxCapacity: 1,
      createdAt: new Date().toISOString(),
    };

    setOptionType(value);

    setEventData({
      ...eventData,
      timeOptionType: typeMap[value],
      timeOptions: [initialTimeOption],
    });
  };

  const addOption = () => {
    if ((eventData.timeOptions?.length ?? 0) >= 6) return;
    setEventData({
      timeOptions: [
        ...(timeOptions || []),
        {
          id: generateId(),
          startTime: '',
          endTime: '',
          maxCapacity: 1,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  };

  const removeOption = (id: number) => {
    console.log(votingDeadline);
    setEventData({
      timeOptions: (timeOptions ?? []).filter((opt) => opt.id !== id),
    });
  };
  const handleCancelClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmClose = () => {
    handleVotingDeadlineChange(getCurrentDatetimeLocal());
    setOpenDialog(false);

    // Optional: clear any error manually if you're tracking it
    //setFormError(false); // if you use error state
  };

  const handleVotingDeadlineChange = (newDeadline: string) => {
    setEventData({
      ...eventData,

      votingDeadline: newDeadline,
    });
  };

  const updateOption = (
    id: number,
    field: 'startTime' | 'endTime' | 'maxCapacity',
    value: string,
  ) => {
    setEventData({
      timeOptions: (timeOptions ?? []).map((opt) =>
        opt.id === id
          ? {
              ...opt,
              [field]: field === 'maxCapacity' ? (value ? Number(value) : undefined) : value,
            }
          : opt,
      ),
    });
  };

  return (
    <Box component="form" style={styles.form}>
      <Box display="flex" flexDirection="column" gap={3} marginLeft={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          Choose How You Want to Schedule Your Event
        </Typography>
        <Box display="flex" flexDirection="column">
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 1}
                onChange={() => handleOptionTypeChange(1)}
                value={1}
              />
            }
            label="Schedule One Specific Time"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 2}
                onChange={() => handleOptionTypeChange(2)}
                value={2}
              />
            }
            label="Let Participants Vote on the Best Time (Up to 6 options)"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 3}
                onChange={() => handleOptionTypeChange(3)}
                value={3}
              />
            }
            label="Create Multiple Time Slots with Capacity Limits"
          />
        </Box>
      </Box>

      <hr style={{ margin: '16px 0' }} />
      {optionType === 1 && eventData.timeOptions && eventData.timeOptions[0] && (
        <TimeOptionFieldsForm
          key={eventData.timeOptions[0].id}
          opt={eventData.timeOptions[0]}
          index={0}
          optionType={optionType}
          updateOption={updateOption}
          removeOption={() => {}}
          multipleOptionsLength={1}
        />
      )}

      {(optionType === 2 || optionType === 3) && (
        <>
          <Box style={{ marginTop: 16 }}>
            <Box style={styles.labelGroup}>
              <Typography style={styles.labelAbove}>Voting Deadline</Typography>

              <DateTimeForm
                label=""
                required
                value={votingDeadline}
                initialValue={votingDeadline}
                onValidChange={(e) => handleVotingDeadlineChange(e)}
              />
              {isUpdate && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mb: 3, mt: 1 }}
                  onClick={() => setOpenDialog(true)} // open dialog here
                >
                  Close Voting
                </Button>
              )}
            </Box>
          </Box>

          <Typography sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            Time Options (You can add up to 6)
          </Typography>
          {(eventData.timeOptions || []).map((opt, i) => (
            <TimeOptionFieldsForm
              key={opt.id}
              opt={opt}
              index={i}
              optionType={optionType}
              updateOption={updateOption}
              removeOption={removeOption}
              multipleOptionsLength={(eventData.timeOptions || []).length}
            />
          ))}

          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              sx={{ width: '70%' }}
              startIcon={<Add />}
              onClick={addOption}
              disabled={(eventData.timeOptions?.length ?? 0) >= 6}
            >
              Add Time Option
            </Button>
          </Box>
        </>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Box sx={{ color: 'red', mt: 2, ml: 2 }}>
          {Object.entries(validationErrors).map(([key, error]) => (
            <Typography key={key} variant="body2">
              • {error}
            </Typography>
          ))}
        </Box>
      )}
      <EventConfirmDialog
        open={openDialog}
        title="Confirm Close Voting"
        onCancel={handleCancelClose}
        onConfirm={handleConfirmClose}
      >
        Are you sure you want to close the voting?
      </EventConfirmDialog>
    </Box>
  );
});

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
