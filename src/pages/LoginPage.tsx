import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '../component/LoginForm';
import PageLayout from '../component/PageLayout';

export default function LoginPage() {
  return (
    <PageLayout>
      <Avatar sx={{ m: 1, bgcolor: '#4B570E' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <LoginForm />
    </PageLayout>
  );
}
