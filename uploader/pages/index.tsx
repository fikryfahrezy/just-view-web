import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from '../styles/Home.module.css';

type FormInputs = {
  id: string;
  password: string;
};

export default function Home() {
  const [loading, isLoading] = useState(false);
  const [show, setShow] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const toast = useToast();

  const onSubmit = function onSubmit(url: string): SubmitHandler<FormInputs> {
    return (data) => {
      isLoading(true);
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status >= 400) throw new Error(res.statusText);

          Router.replace('/form');
        })
        .catch(() => {
          toast({
            title: 'fail',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(() => {
          isLoading(false);
        });
    };
  };

  const handleClick = () => setShow(!show);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container
        display='flex'
        minHeight='100vh'
        maxWidth='100vw'
        padding='0 0.5rem'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
      >
        <main className={styles.main}>
          <Heading as='h2' mb='15px'>
            Log In
          </Heading>
          <form onSubmit={handleSubmit(onSubmit('/api/login'))}>
            <label htmlFor='id'>ID</label>
            <Input
              {...register('id', { required: true })}
              mb='15px'
              errorBorderColor='crimson'
              isInvalid={Boolean(errors.id)}
              id='id'
              name='id'
              type='text'
            />
            <label htmlFor='password'>Password</label>
            <InputGroup mb='15px'>
              <Input
                {...register('password', { required: true })}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                errorBorderColor='crimson'
                isInvalid={Boolean(errors.password)}
                id='password'
                name='password'
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button colorScheme='blue' type='submit'>
              Log In
            </Button>
          </form>
          {loading && (
            <Flex marginY='20px'>
              <Spinner marginRight='15px' />
              <Text>Loading ...</Text>
            </Flex>
          )}
        </main>

        <footer className={styles.footer}>
          <a
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
            </span>
          </a>
        </footer>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { auth } = req.cookies;

  if (auth) {
    return {
      redirect: {
        destination: '/form',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
