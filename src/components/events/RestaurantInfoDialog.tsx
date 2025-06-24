import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { RestaurantOptionDto } from '../../types/Event';
import { buttonStyle } from '../../styles/CommonStyles';

interface Props {
  open: boolean;
  onClose: () => void;
  restaurant: RestaurantOptionDto;
}

export default function RestaurantInfoDialog({ open, onClose, restaurant }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{restaurant.name}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          Menu: <a href={restaurant.menuImageUrl} target="_blank" rel="noreferrer">{restaurant.menuImageUrl}</a><br/>
          Website: <a href={restaurant.restaurantUrl} target="_blank" rel="noreferrer">{restaurant.restaurantUrl}</a>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={buttonStyle}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
