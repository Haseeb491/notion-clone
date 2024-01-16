'use client';

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../../public/cypresslogo.svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { actionLoginUser } from '@/lib/server-action/auth-actions';

const LoginPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState('');

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: { email: '', password: '' }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (FormData) => {
        const { error } = await actionLoginUser(FormData);
        if (error) {
            form.reset();
            setSubmitError(error.message);
        }
        router.replace('/dashboard');
    }

    return (
        <Form {...form} >
            <form
                onChange={() => {
                    if (submitError) {
                        setSubmitError('')
                    }
                }}
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full flex sm:justify-center sm:w-[400px] space-y-6 flex-col '
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
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full p-6'
                    size='lg'
                >
                    {!isLoading ? 'Login' : <Loader />}
                </Button>
                <span className='self-center' >
                    Don't have an account?
                    <Link href='/signup' className='text-primary' >Sign up</Link>
                </span>
            </form>

        </Form>
    )
}

export default LoginPage