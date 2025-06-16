import { Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '../components/login/LoginForm';
import { containerStyle, avatarStyle } from '../styles/CommonStyles';

export default function LoginPage() {
  return (
    <Container sx={containerStyle}>
      <Avatar sx={avatarStyle}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <LoginForm />
    </Container>
  );
}
