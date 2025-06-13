import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn } = useAuthStore();
    const [searchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'auth_failed') {
            toast.error('Failed to sign in with Google. Please try again.', {
                style: {
                    background: 'hsl(var(--b1))',
                    color: 'hsl(var(--bc))',
                    borderColor: 'hsl(var(--er))',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                icon: '❌',
                duration: 4000,
            });
        }
    }, [searchParams]);

    const onSubmit = async (data) => {
        await login(data);
    }

    return (
        <>
            <Helmet>
                <title>Welcome Back to Chatty! – Login & Continue the Conversation</title>
                <meta
                    name="description"
                    content="Sign in to Chatty and jump right into your chats! Quick, secure, and seamless messaging awaits."
                />
            </Helmet>
            <div className='min-h-screen grid lg:grid-cols-2'>
                {/* Left side of the Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-col items-center justify-center p-6 sm:p-12'
                >
                    <div className='w-full max-w-md space-y-8'>
                        {/* Logo */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className='text-center mb-8'
                        >
                            <div className='flex flex-col items-center gap-2 group'>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='size-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300'
                                >
                                    <MessageSquare className='size-8 text-primary' />
                                </motion.div>
                                <h1 className='text-3xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>Welcome Back</h1>
                                <p className='text-base-content/60 text-lg'>Sign in to your account</p>
                            </div>
                        </motion.div>

                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            onSubmit={handleSubmit(onSubmit)}
                            className='space-y-6'
                        >
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Email</span>
                                </label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 z-10 flex pointer-events-none items-center pl-3'>
                                        <Mail className='size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300' />
                                    </div>
                                    <input
                                        type="email"
                                        className={`input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:duration-200 focus:border-primary input-bordered w-full pl-10 transition-all duration-300 ${errors.email ? 'border-error' : ''}`}
                                        placeholder='you@example.com'
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="text-error text-sm mt-1">{errors.email.message}</span>
                                )}
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Password</span>
                                </label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 z-10 flex pointer-events-none items-center pl-3'>
                                        <Lock className='size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300' />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:duration-200 focus:border-primary input-bordered w-full pl-10 transition-all duration-300 ${errors.password ? 'border-error' : ''}`}
                                        placeholder='••••••'
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type='button'
                                        className='absolute inset-y-0 z-10 right-0 pr-3 flex items-center'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className='size-5 text-base-content/40 cursor-pointer' /> : <Eye className='size-5 text-base-content/40 cursor-pointer' />}
                                    </motion.button>
                                </div>
                                {errors.password && (
                                    <span className="text-error text-sm mt-1">{errors.password.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="btn btn-primary w-full h-12 text-base font-medium transition-all duration-300 rounded-lg relative overflow-hidden group hover:brightness-110"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                {isLoggingIn ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className='size-5 animate-spin' />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    <span className="relative flex items-center justify-center gap-2">
                                        Sign in
                                    </span>
                                )}
                            </button>
                        </motion.form>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className='text-center'
                        >
                            <p className='text-base-content/60'>
                                Don&apos;t have an account?{" "}
                                <Link to="/sign-up" className="link link-primary font-medium hover:underline">Create Account</Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
                {/* Right side with background image */}
                <AuthImagePattern
                    title="Welcome back!"
                    subtitle="Sign in to continue chatting with your friends and stay connected in real-time."
                />
            </div>
        </>

    )
}

export default LoginPage;
