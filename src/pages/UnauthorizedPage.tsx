import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { buttonStyle } from '../styles/style';

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized Page</h1>
      <Link to={'/'}>
        <Button variant="contained" sx={buttonStyle}>
          Go back home
        </Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
