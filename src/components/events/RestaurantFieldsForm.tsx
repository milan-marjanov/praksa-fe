// RestaurantFieldsForm.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { RestaurantOption } from './RestaurantOptionsForm';

interface Props {
  index: number;
  option: RestaurantOption;
  onChangeOption: (id: number, field: keyof RestaurantOption, value: string) => void;
  errorMap: Record<string, string | undefined>;
}

const RestaurantFieldsForm: React.FC<Props> = ({ index, option, onChangeOption, errorMap }) => {
  return (
    <>
      <TextField
        required
        label="Restaurant Name"
        fullWidth
        value={option?.name || ''}
        onChange={(e) => onChangeOption(option.id, 'name', e.target.value)}
        error={!!errorMap[`restaurant-${index}-name`]}
        helperText={errorMap[`restaurant-${index}-name`]}
        margin="dense"
      />
      <TextField
        label="Menu Image URL (optional)"
        fullWidth
        value={option?.menuImageUrl || ''}
        onChange={(e) => onChangeOption(option.id, 'menuImageUrl', e.target.value)}
        margin="dense"
      />
      <TextField
        label="Restaurant Website (optional)"
        fullWidth
        value={option?.restaurantUrl || ''}
        onChange={(e) => onChangeOption(option.id, 'restaurantUrl', e.target.value)}
        margin="dense"
      />
    </>
  );
};

export default RestaurantFieldsForm;
