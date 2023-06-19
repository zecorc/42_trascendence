// pages/login.js (o login.tsx)

import { Button, Card, TextInput } from '@mantine/core';

export default function Login() {
  return (
    <div className="login-container">
      <Card shadow="xs" padding="lg">
        <h1 className="login-title">Login</h1>
        <TextInput label="Email" placeholder="Enter your email" />
        <TextInput label="Password" type="password" placeholder="Enter your password" />
        <Button size="lg">Login</Button>
        <Button size="lg" variant="light">
          Register
        </Button>
      </Card>
    </div>
  );
}
