'use client';

import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import Logo from '../../../../public/cypresslogo.svg'
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';
import { FormSchema } from '@/lib/types';
import { actionSignUpuser } from '@/lib/server-action/auth-actions';

const SignupFormSchema = z.object({
    email: z.string().describe('Email').email({ message: 'Invalid email' }),
    password: z.string().describe('Password').min(6, 'password must contain 6 charachters'),
    confirmPassword: z.string().describe('Confirm Password').min(6, 'passwor must contain atleast 6 charachters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ['confirmPassword'],
});

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState('');
    const [confirmation, setComfirmation] = useState(false);

    const codeExchangeError = useMemo(() => {
        if (!searchParams) {
            return '';
        }
        return searchParams.get('error_description');
    }, [searchParams]);

    const confirmationAndErrorStyles = useMemo(
        () => clsx('bg-primary', {
            'bg-red-500/10': codeExchangeError,
            'border-red-500/50': codeExchangeError,
            'text-red-700': codeExchangeError,
        })
        , []);

    const form = useForm<z.infer<typeof SignupFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(SignupFormSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
        const { error } = await actionSignUpuser({ email, password });
        if (error) {
            setSubmitError(error.message);
            form.reset();
            return;
        }
        setComfirmation(true);

    };


    return (
        <Form {...form} >
            <form
                onChange={() => {
                    if (submitError) setSubmitError('');
                }}
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full sm:justify-center flex sm:w-[400px]
                space-y-6  flex-col'
            >
                <Link
                    href='/'
                    className='w-full flex items-center justify-center'
                >
                    <Image src={Logo} alt='Jotion logo' width={50} height={50} />
                    <span className='font-semibold dark:text-white text-4xl ml-2' >
                        Jotion
                    </span>
                </Link>
                <FormDescription className='text-foreground/60' >
                    Jotion! All in one collaboration and productivity platform
                </FormDescription>
                {!confirmation && !codeExchangeError && (
                    <>
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='email' placeholder='Email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='password' placeholder='Password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='password' placeholder='Confirm Password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            {!isLoading ? 'Create account' : <Loader />}
                        </Button>
                    </>
                )}

                {submitError && <FormMessage>{submitError}</FormMessage>}
                <span className='self-center' >
                    Already have an account?{' '}
                    <Link href='/login' className='text-primary' >Login</Link>
                </span>
                {(confirmation || codeExchangeError) && (
                    <>
                        <Alert className={confirmationAndErrorStyles} >
                            {!codeExchangeError && <MailCheck className='h-4 w-4' />}
                            <AlertTitle>
                                {codeExchangeError ? 'Invalid Link' : 'Check your email'}
                            </AlertTitle>
                            <AlertDescription>
                                {codeExchangeError || 'an email has been sent'}
                            </AlertDescription>
                        </Alert>
                    </>
                )}
            </form>
        </Form>
    )
}

export default Signup