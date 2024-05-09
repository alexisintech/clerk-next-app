'use client';

import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const router = useRouter();

  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoaded) {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      // This is mainly for debugging while developing.
      if (completeSignIn.status !== 'complete') {
        console.log(JSON.stringify(completeSignIn, null, 2));
        setError(JSON.stringify(completeSignIn, null, 2));
      }

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(JSON.stringify(err, null, 2));
    }
  };

  // Display a form to capture the user's email and password
  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="email">Enter email address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <p>{error}</p>
    </>
  );
}
