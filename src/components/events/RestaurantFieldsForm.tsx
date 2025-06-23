import React from 'react';
import TextField from '@mui/material/TextField';
import { RestaurantOption } from '../../types/Event';

interface Props {
  index: number;
  option: RestaurantOption;
  onChangeOption: (id: number, field: keyof RestaurantOption, value: string) => void;
}

const RestaurantFieldsForm: React.FC<Props> = ({ option, onChangeOption }) => {
  return (
    <>
      <TextField
        required
        label="Restaurant Name"
        fullWidth
        value={option?.name || ''}
        onChange={(e) => onChangeOption(option.id, 'name', e.target.value)}
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
