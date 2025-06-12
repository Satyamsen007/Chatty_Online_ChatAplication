import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, Github, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            window.location.href = `${apiUrl}/api/auth/google`;
        } catch (error) {
            toast.error("Failed to sign in with Google", {
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
            setIsGoogleLoading(false);
        }
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

                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-base-content/10'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-2 bg-base-100 text-base-content/60'>Or continue with</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ backgroundColor: "hsl(var(--b2))" }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="btn btn-outline rounded-lg w-full h-12 text-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group border-2 hover:border-primary"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-base-content/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                {isGoogleLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="size-5 animate-spin" />
                                        <span>Connecting to Google...</span>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="size-5 transition-transform duration-300" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="relative">Sign in with Google</span>
                                    </>
                                )}
                            </motion.button>
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
