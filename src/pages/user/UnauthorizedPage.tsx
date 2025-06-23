import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized Page</h1>
      <Link to={'/'}>
        <Button variant="contained" size="large" color="secondary" sx={{ fontSize: '1rem' }}>
          Go back home
        </Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
